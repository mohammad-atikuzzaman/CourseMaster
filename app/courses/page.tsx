"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourses, reset } from "@/redux/features/courses/courseSlice";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import { Search, Star, Users, Clock, ChevronRight } from "lucide-react";

export default function CoursesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, isLoading, isError, message, page, pages, total } = useSelector((s: RootState) => s.course);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);

  useEffect(() => {
    dispatch(getCourses({ search: searchTerm || undefined, page: currentPage, limit }));
    return () => { dispatch(reset()); };
  }, [dispatch, searchTerm, currentPage, limit]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(getCourses({ search: searchTerm || undefined, page: 1, limit }));
  };

  const goToPage = (p: number) => setCurrentPage(p);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
            <p className="mt-2 text-gray-600">Browse the complete catalog</p>
          </div>
          <div className="text-sm text-gray-500">Total {total}</div>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-linear-to-r from-gray-200 to-gray-300" />
                <div className="p-6 space-y-4">
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="h-6 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <div className="text-red-500 text-lg font-semibold">Failed to load courses</div>
            <p className="text-gray-600 mt-2">{message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all">
                <div className="relative overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-white">4.8</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      <Link href={`/courses/${course._id}`}>{course.title}</Link>
                    </h3>
                    <div className="text-2xl font-bold text-indigo-600">${course.price}</div>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>1.2k students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>12 hours</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/courses/${course._id}`} className="px-4 py-2 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition flex items-center gap-2">
                      View <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && pages > 1 && (
          <div className="mt-12 flex items-center justify-between">
            <div className="text-gray-600">Page {page} of {pages} • {total} total</div>
            <div className="flex items-center gap-2">
              <button disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)} className="px-4 py-2 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-50">Previous</button>
              {Array.from({ length: Math.min(5, pages) }).map((_, i) => (
                <button key={i} onClick={() => goToPage(i + 1)} className={`px-4 py-2 rounded-lg transition ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'}`}>{i + 1}</button>
              ))}
              <button disabled={currentPage >= pages} onClick={() => goToPage(currentPage + 1)} className="px-4 py-2 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

