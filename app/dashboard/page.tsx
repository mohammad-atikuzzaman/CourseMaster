'use client';

import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '@/redux/features/auth/authSlice';
import { AppDispatch, RootState } from '@/redux/store';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        router.push('/login');
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <button
                            onClick={onLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold text-indigo-800 mb-2">
                            Welcome, {user && user.name}
                        </h2>
                        <p className="text-gray-700">Email: {user && user.email}</p>
                        <p className="text-gray-700">Role: {user && user.role}</p>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Content</h3>
                        <p className="text-gray-600">This is a protected page. Only authenticated users can see this.</p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
