'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import { getCourseById } from '@/redux/features/courses/courseSlice';
import { getMyEnrollments } from '@/redux/features/enrollments/enrollmentSlice';
import { AppDispatch, RootState } from '@/redux/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Loader2, CheckCircle, Circle, ChevronLeft } from 'lucide-react';
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

    const [activeModule, setActiveModule] = useState<any>(null);

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
        }
    }, [dispatch, courseId]);

    const enrollment = enrollments.find((e) => e.course._id === courseId);

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
            <div className="flex h-screen bg-gray-100 overflow-hidden">
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
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white shadow-sm p-4 md:hidden">
                        <h1 className="text-lg font-bold truncate">{course.title}</h1>
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
