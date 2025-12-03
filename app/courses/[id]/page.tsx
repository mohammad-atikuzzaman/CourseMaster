'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { getCourseById, reset } from '@/redux/features/courses/courseSlice';
import { enrollCourse } from '@/redux/features/enrollments/enrollmentSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Loader2, CheckCircle, PlayCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function CourseDetails() {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const { course, isLoading, isError, message } = useSelector(
        (state: RootState) => state.course
    );
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (id) {
            dispatch(getCourseById(id as string));
        }

        return () => {
            dispatch(reset());
        };
    }, [dispatch, id]);

    const handleEnroll = () => {
        if (!user) {
            router.push('/login');
        } else {
            dispatch(enrollCourse(id as string))
                .unwrap()
                .then(() => {
                    toast.success('Enrolled successfully');
                    router.push('/dashboard/student');
                })
                .catch((err) => {
                    toast.error(typeof err === 'string' ? err : 'Enrollment failed');
                });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Error: {message}
            </div>
        );
    }

    if (!course) {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Header */}
            <div className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="lg:w-2/3">
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                                {course.title}
                            </h1>
                            <p className="text-lg text-gray-300 mb-6">{course.description}</p>
                            <div className="flex items-center space-x-4 text-sm">
                                <span className="bg-indigo-600 px-3 py-1 rounded-full">
                                    {course.category}
                                </span>
                                <span>Created by {course.instructor?.name}</span>
                                <span>Last updated {new Date(course.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="mt-8 lg:mt-0 lg:w-1/3 lg:pl-8">
                            <div className="bg-white text-gray-900 rounded-lg shadow-lg p-6">
                                <div className="aspect-w-16 aspect-h-9 mb-6 rounded-md overflow-hidden bg-gray-200">
                                    <img src={course.thumbnail} alt={course.title} className="object-cover"  />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-6">
                                    ${course.price}
                                </div>
                                <button
                                    onClick={handleEnroll}
                                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Enroll Now
                                </button>
                                <div className="mt-3">
                                    <Link
                                        href={`/courses/${course._id}/assignments`}
                                        className="w-full inline-flex justify-center bg-white border border-indigo-200 text-indigo-600 py-3 px-4 rounded-md font-medium hover:bg-indigo-50 transition-colors"
                                    >
                                        View Assignments
                                    </Link>
                                </div>
                                <p className="mt-4 text-xs text-center text-gray-500">
                                    30-Day Money-Back Guarantee
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course.tags.map((tag, index) => (
                                <div key={index} className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                    <span className="text-gray-600">Master {tag} concepts</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
                        <div className="space-y-4">
                            {course.syllabus.map((module, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <PlayCircle className="h-5 w-5 text-indigo-600 mr-3" />
                                            <span className="font-medium text-gray-900">{module.title}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">{module.duration} min</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
