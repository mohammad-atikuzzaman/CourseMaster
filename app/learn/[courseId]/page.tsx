'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import { getCourseById } from '@/redux/features/courses/courseSlice';
import { getCourseAssignments, getMySubmissionsByCourse, submitAssignment } from '@/redux/features/assignments/assignmentSlice';
import { getMyEnrollments } from '@/redux/features/enrollments/enrollmentSlice';
import { AppDispatch, RootState } from '@/redux/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Loader2, CheckCircle, Circle, ChevronLeft, Menu, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function CoursePlayer() {
    const { courseId } = useParams();
    const dispatch = useDispatch<AppDispatch>();

    const { course, isLoading: courseLoading } = useSelector(
        (state: RootState) => state.course
    );
    const { enrollments, isLoading: enrollmentLoading } = useSelector(
        (state: RootState) => state.enrollment
    );
    const { assignments, submissions } = useSelector((state: RootState) => state.assignments);

    const [activeModule, setActiveModule] = useState<any>(null);
    const [repoUrl, setRepoUrl] = useState('');
    const [deploymentUrl, setDeploymentUrl] = useState('');

    const getEmbedUrl = (url?: string) => {
        if (!url) return '';
        try {
            // Already an embed URL
            if (url.includes('/embed/')) return url;
            // youtu.be short links
            if (url.includes('youtu.be/')) {
                const id = url.split('youtu.be/')[1].split('?')[0];
                return `https://www.youtube.com/embed/${id}`;
            }
            // standard watch URL
            const u = new URL(url);
            if (u.hostname.includes('youtube.com')) {
                const id = u.searchParams.get('v');
                if (id) return `https://www.youtube.com/embed/${id}`;
            }
            return url;
        } catch {
            return url || '';
        }
    };

    useEffect(() => {
        if (courseId) {
            dispatch(getCourseById(courseId as string));
            dispatch(getMyEnrollments());
            dispatch(getCourseAssignments(courseId as string));
            dispatch(getMySubmissionsByCourse(courseId as string));
        }
    }, [dispatch, courseId]);

    const enrollment = enrollments.find((e) => e.course._id === courseId);

    const currentModule = (activeModule || (course?.syllabus || [])[0]);
    const moduleIndex = course?.syllabus?.findIndex((m: any) => m === currentModule) ?? -1;
    const currentAssignment = assignments.find(a => a.moduleIndex === moduleIndex);
    const mySubmission = submissions.find(s => s.assignment === currentAssignment?._id);

    const onSubmitAssignment = async () => {
        if (!currentAssignment) {
            toast.error('No assignment for this module');
            return;
        }
        const currentModuleId = currentModule?._id;
        const completed = (enrollment?.completedLessons || []).includes(currentModuleId);
        if (!completed) {
            toast.error('Complete this module before submitting the assignment');
            return;
        }
        try {
            await dispatch(submitAssignment({ assignmentId: currentAssignment._id, repoUrl, deploymentUrl })).unwrap();
            toast.success('Assignment submitted');
            setRepoUrl('');
            setDeploymentUrl('');
            dispatch(getMySubmissionsByCourse(courseId as string));
        } catch (e: any) {
            toast.error(typeof e === 'string' ? e : 'Failed to submit');
        }
    };

    const handleMarkComplete = async (moduleId: string) => {
        try {
            const response = await api.put(`/enrollments/${courseId}/progress`, {
                lessonId: moduleId,
            });
            dispatch(getMyEnrollments());
            toast.success('Lesson marked as complete');
        } catch (error) {
            console.error('Failed to update progress', error);
            toast.error('Failed to update progress');
        }
    };

    if (courseLoading || enrollmentLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <ProtectedRoute allowedRoles={['user', 'admin', 'instructor']}>
            <div className="flex min-h-[calc(100vh-56px)] bg-gray-100 overflow-hidden">
                {/* Sidebar */}
                <div className="w-80 bg-white shadow-lg overflow-y-auto hidden md:block">
                    <div className="p-4 border-b">
                        <Link
                            href="/dashboard/student"
                            className="flex items-center text-sm text-gray-500 hover:text-gray-900"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to Dashboard
                        </Link>
                        <h2 className="mt-4 text-lg font-bold text-gray-900">{course.title}</h2>
                        <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{Math.round(enrollment?.progress || 0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.round(enrollment?.progress || 0)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        {course.syllabus.map((module: any, index: number) => (
                            <button
                                key={module._id || index}
                                onClick={() => setActiveModule(module)}
                                className={`w-full flex items-center p-3 rounded-md mb-1 transition-colors ${activeModule === module
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                <div className="mr-3">
                                    {(enrollment?.completedLessons || []).includes(module._id) ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-gray-300" />
                                    )}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium">{module.title}</p>
                                    <p className="text-xs text-gray-500">{module.duration} min</p>
                                    {(() => {
                                        const a = assignments.find(ax => ax.moduleIndex === index);
                                        const sub = submissions.find(s => s.assignment === a?._id);
                                        if (!a) return null;
                                        return (
                                            <span className={`mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full ${sub ? (sub.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700') : 'bg-gray-100 text-gray-700'}`}>
                                                {sub ? (sub.status === 'graded' ? `Assignment graded ${sub.score ?? ''}` : 'Assignment submitted') : 'Assignment pending'}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white shadow-sm p-4 md:hidden">
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-bold truncate">{course.title}</h1>
                            <MobileModulesButton course={course} modules={course.syllabus} assignments={assignments} submissions={submissions} activeModule={activeModule} setActiveModule={setActiveModule} />
                        </div>
                        <div className="mt-2">
                            <Link href={`/learn/${course._id}/assignments`} className="text-indigo-600 text-sm">Assignments</Link>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                        {activeModule || (course.syllabus && course.syllabus.length > 0) ? (
                            <div className="max-w-4xl mx-auto">
                                <div className="relative rounded-lg overflow-hidden shadow-lg mb-8">
                                    <div className="w-full" style={{ aspectRatio: '16 / 9' }}>
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={getEmbedUrl((activeModule as any)?.content)}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {(activeModule || course.syllabus[0]).title}
                                    </h1>
                                    <button
                                        onClick={() => handleMarkComplete((activeModule || course.syllabus[0])._id)}
                                        disabled={(enrollment?.completedLessons || []).includes((activeModule || course.syllabus[0])._id)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${(enrollment?.completedLessons || []).includes((activeModule || course.syllabus[0])._id)
                                                ? 'bg-green-100 text-green-800 cursor-default'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                    >
                                        {(enrollment?.completedLessons || []).includes((activeModule || course.syllabus[0])._id)
                                            ? 'Completed'
                                            : 'Mark as Complete'}
                                    </button>
                                </div>

                                <div className="prose max-w-none">
                                    <p className="text-gray-600">
                                        This is where the lesson description and additional resources would go.
                                    </p>
                                </div>

                                {/* Assignment panel */}
                                <div className="mt-8">
                                    {currentAssignment ? (
                                        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-lg font-semibold">Assignment</h2>
                                                    <p className="text-sm text-gray-600">Submit your GitHub repo and live deployment</p>
                                                </div>
                                                <div className="text-sm">
                                                    {mySubmission ? (
                                                        <span className={`px-3 py-1 rounded-full ${mySubmission.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {mySubmission.status === 'graded' ? 'Graded' : 'Submitted'}
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">Not submitted</span>
                                                    )}
                                                </div>
                                            </div>

                                            {mySubmission?.score !== undefined && (
                                                <div className="mt-3 text-sm text-gray-700">Score: {Math.round(mySubmission.score as number)}</div>
                                            )}

                                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="url"
                                                    placeholder="GitHub repository URL"
                                                    className="w-full px-4 py-2 rounded-md border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                                    value={repoUrl}
                                                    onChange={(e) => setRepoUrl(e.target.value)}
                                                    disabled={!!mySubmission}
                                                />
                                                <input
                                                    type="url"
                                                    placeholder="Live deployment URL"
                                                    className="w-full px-4 py-2 rounded-md border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                                    value={deploymentUrl}
                                                    onChange={(e) => setDeploymentUrl(e.target.value)}
                                                    disabled={!!mySubmission}
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <button
                                                    onClick={onSubmitAssignment}
                                                    disabled={!!mySubmission}
                                                    className={`px-4 py-2 rounded-md text-sm font-medium ${mySubmission ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                                >
                                                    {mySubmission ? 'Already submitted' : 'Submit Assignment'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">No assignment for this module</div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-full text-gray-500">
                                Select a lesson to start watching
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}

function MobileModulesButton({ course, modules, assignments, submissions, activeModule, setActiveModule }: any) {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <button onClick={() => setOpen((o: boolean) => !o)} aria-expanded={open} aria-controls="mobile-modules" className="p-2 rounded-md border hover:bg-gray-50">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            {open && (
                <div id="mobile-modules" className="mt-3 border rounded-md bg-white max-h-80 overflow-y-auto">
                    {modules.map((module: any, index: number) => (
                        <button
                            key={module._id || index}
                            onClick={() => {
                                setActiveModule(module);
                                setOpen(false);
                            }}
                            className={`w-full flex items-center p-3 rounded-md mb-1 transition-colors ${activeModule === module ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            <div className="mr-3">
                                <Circle className="h-5 w-5 text-gray-300" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium">{module.title}</p>
                                <p className="text-xs text-gray-500">{module.duration} min</p>
                                {(() => {
                                    const a = assignments.find((ax: any) => ax.moduleIndex === index);
                                    const sub = submissions.find((s: any) => s.assignment === a?._id);
                                    if (!a) return null;
                                    return (
                                        <span className={`mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full ${sub ? (sub.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700') : 'bg-gray-100 text-gray-700'}`}>
                                            {sub ? (sub.status === 'graded' ? `Assignment graded ${sub.score ?? ''}` : 'Assignment submitted') : 'Assignment pending'}
                                        </span>
                                    );
                                })()}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
