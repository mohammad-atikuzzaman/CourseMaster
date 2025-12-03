'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCourses, reset } from '@/redux/features/courses/courseSlice';
import { AppDispatch, RootState } from '@/redux/store';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const { courses, isLoading, isError, message } = useSelector(
        (state: RootState) => state.course
    );
    const { user } = useSelector((state: RootState) => state.auth);

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        dispatch(getCourses({}));

        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            await api.delete(`/courses/${id}`);
            // Refresh list
            dispatch(getCourses({}));
            toast.success('Course deleted');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete course');
        }
    };

    return (
        <ProtectedRoute allowedRoles={['admin', 'instructor']}>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{isAdmin ? 'Admin Dashboard' : 'Instructor Dashboard'}</h1>
                            <p className="mt-2 text-gray-600">Manage your courses and students.</p>
                        </div>
                        {(isAdmin || user?.role === 'instructor') && (
                            <Link
                                href="/dashboard/admin/create-course"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Course
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                href="/dashboard/admin/users"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-50"
                            >
                                Manage Users
                            </Link>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                        </div>
                    ) : isError ? (
                        <div className="text-center text-red-500 py-10">
                            Error: {message}
                        </div>
                    ) : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <ul role="list" className="divide-y divide-gray-200">
                                {(isAdmin ? courses : courses.filter((c) => c.instructor?._id === user?._id)).map((course) => (
                                    <li key={course._id}>
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <img
                                                        className="rounded-full mr-4"
                                                        src={course.thumbnail}
                                                        alt={course.title}
                                                    />
                                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                                        {course.title}
                                                    </p>
                                                </div>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {course.category}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500">
                                                        Price: ${course.price}
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm sm:mt-0 space-x-4">
                                                    {(isAdmin || course.instructor?._id === user?._id) && (
                                                        <>
                                                            <Link href={`/dashboard/admin/edit-course/${course._id}`} className="text-indigo-600 hover:text-indigo-900">
                                                                <Edit className="h-5 w-5" />
                                                            </Link>
                                                            <Link href={`/dashboard/admin/enrollments/${course._id}`} className="text-indigo-600 hover:text-indigo-900">
                                                                Manage Enrollments
                                                            </Link>
                                                            <Link href={`/courses/${course._id}/assignments`} className="text-indigo-600 hover:text-indigo-900">
                                                                Assignments
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(course._id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <Trash2 className="h-5 w-5" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
