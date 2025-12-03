'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyEnrollments, reset } from '@/redux/features/enrollments/enrollmentSlice';
import { AppDispatch, RootState } from '@/redux/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { Loader2, PlayCircle } from 'lucide-react';

export default function StudentDashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const { enrollments, isLoading, isError, message } = useSelector(
        (state: RootState) => state.enrollment
    );
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(getMyEnrollments());

        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    return (
        <ProtectedRoute allowedRoles={['user', 'admin', 'instructor']}>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
                        <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                        </div>
                    ) : isError ? (
                        <div className="text-center text-red-500 py-10">
                            Error: {message}
                        </div>
                    ) : enrollments.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                            <h3 className="text-xl font-medium text-gray-900">No courses enrolled yet</h3>
                            <p className="mt-2 text-gray-500">Start your learning journey today.</p>
                            <Link
                                href="/"
                                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Browse Courses
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {enrollments.map((enrollment) => (
                                <div
                                    key={enrollment._id}
                                    className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="rounded-md object-cover"
                                                    src={enrollment.course.thumbnail}
                                                    alt={enrollment.course.title}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                                    {enrollment.course.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {enrollment.course.category}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-5 py-3">
                                        <div className="mb-2 flex justify-between text-sm font-medium">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="text-indigo-600">{Math.round(enrollment.progress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                            <div
                                                className="bg-indigo-600 h-2.5 rounded-full"
                                                style={{ width: `${enrollment.progress}%` }}
                                            ></div>
                                        </div>
                                        <Link
                                            href={`/learn/${enrollment.course._id}`}
                                            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            <PlayCircle className="mr-2 h-4 w-4" />
                                            Continue Learning
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
