'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({
    children,
    allowedRoles,
}: ProtectedRouteProps) {
    const { user } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (allowedRoles && !allowedRoles.includes(user.role)) {
            router.push('/dashboard'); // Or unauthorized page
            alert('You are not authorized to view this page');
        }
    }, [user, allowedRoles, router]);

    if (!user) {
        return null; // Or a loading spinner
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
