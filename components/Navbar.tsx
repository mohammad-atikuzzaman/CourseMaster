"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { logout, reset } from "@/redux/features/auth/authSlice";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
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
             CourseMaster
            </Link>
            <nav className="hidden md:flex items-center gap-2 text-sm">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-md transition ${
                  pathname === "/" ? "bg-gray-100" : "hover:bg-gray-100"
                }`}
              >
                Home
              </Link>
              <Link
                href="/courses"
                className={`px-3 py-1.5 rounded-md transition ${
                  pathname?.startsWith("/courses")
                    ? "bg-gray-100"
                    : "hover:bg-gray-100"
                }`}
              >
                Courses
              </Link>
              {user && (
                <Link
                  href="/dashboard/student"
                  className={`px-3 py-1.5 rounded-md transition ${
                    pathname?.startsWith("/dashboard/student")
                      ? "bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  My Courses
                </Link>
              )}
              {(user?.role === "admin" || user?.role === "instructor") && (
                <Link
                  href="/dashboard/admin"
                  className={`px-3 py-1.5 rounded-md transition ${
                    pathname?.startsWith("/dashboard/admin")
                      ? "bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
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
            <button
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 rounded-md border hover:bg-gray-50 transition"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div id="mobile-nav" className="md:hidden border-t bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm ${
                pathname === "/" ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
            <Link
              href="/courses"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm ${
                pathname?.startsWith("/courses")
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
            >
              Courses
            </Link>
            {user && (
              <Link
                href="/dashboard/student"
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm ${
                  pathname?.startsWith("/dashboard/student")
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                My Courses
              </Link>
            )}
            {(user?.role === "admin" || user?.role === "instructor") && (
              <Link
                href="/dashboard/admin"
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm ${
                  pathname?.startsWith("/dashboard/admin")
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                Dashboard
              </Link>
            )}
            {!user ? (
              <div className="pt-2 border-t mt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="pt-2 border-t mt-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
