"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { logout, reset } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-lg font-bold text-indigo-700 hover:text-indigo-800 transition"
            >
              MS Academy
            </Link>
            <nav className="hidden md:flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-md hover:bg-gray-100 transition"
              >
                Home
              </Link>
              <Link
                href="/dashboard/student"
                className="px-3 py-1.5 rounded-md hover:bg-gray-100 transition"
              >
                My Courses
              </Link>
              {(user?.role === "admin" || user?.role === "instructor") && (
                <Link
                  href="/dashboard/admin"
                  className="px-3 py-1.5 rounded-md hover:bg-gray-100 transition"
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-gray-600">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
