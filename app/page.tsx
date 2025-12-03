"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCourses, reset } from "@/redux/features/courses/courseSlice";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import { Search, Filter, Star, Users, Clock, TrendingUp, Award, ChevronRight, Play, BookOpen, Sparkles, ArrowRight, X } from "lucide-react";
import api from '@/lib/api';
import { toast } from "react-hot-toast";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, isLoading, isError, message, page, pages, total } =
    useSelector((state: RootState) => state.course);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(3);
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(
      getCourses({
        search: searchTerm || undefined,
        category: category || undefined,
        minPrice: minPrice !== "" ? Number(minPrice) : undefined,
        maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
        sort: sort || undefined,
        page: currentPage,
        limit,
      })
    );

    return () => {
      dispatch(reset());
    };
  }, [
    dispatch,
    searchTerm,
    category,
    minPrice,
    maxPrice,
    sort,
    currentPage,
    limit,
  ]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(message || "Failed to load courses");
    }
  }, [isError, message]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(
      getCourses({
        search: searchTerm || undefined,
        category: category || undefined,
        minPrice: minPrice !== "" ? Number(minPrice) : undefined,
        maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
        sort: sort || undefined,
        page: 1,
        limit,
      })
    );
  };

  const goToPage = (p: number) => {
    setCurrentPage(p);
  };

  const categories = [
    "Web Development",
    "Data Science",
    "UI/UX Design",
    "Mobile Development",
    "Business",
    "Marketing",
    "Photography",
    "Music",
  ];

  const [instructors, setInstructors] = useState<any[]>([]);

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const iRes = await api.get('/instructors');
        setInstructors(iRes.data || []);
      } catch {}
    };
    loadInstructors();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-r from-indigo-700/50 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-96 bg-linear-to-b from-white/10 to-transparent" />
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
              <span className="text-sm font-medium text-white">Welcome to MS Academy</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="block text-white">Learn from the</span>
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-pink-300 mt-2">
                World's Best
              </span>
            </h1>
            
            <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto lg:mx-0">
              Master in-demand skills with industry-expert courses, hands-on projects, and career support.
            </p>

            <div className="mt-10 max-w-2xl mx-auto lg:mx-0">

              
              <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3">
                {["Web Development", "Data Science", "UI/UX", "Business"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-indigo-200 mt-1">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-indigo-200 mt-1">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100+</div>
                <div className="text-sm text-indigo-200 mt-1">Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4.8</div>
                <div className="text-sm text-indigo-200 mt-1">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="relative -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Job Success Rate</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Mentor Support</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <Play className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">1000+</div>
                <div className="text-sm text-gray-600">Hours Content</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Categories</h2>
            <p className="mt-2 text-gray-600">Explore courses by category</p>
          </div>
          
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                category === cat 
                  ? 'border-indigo-500 bg-indigo-50 shadow-lg' 
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className="h-10 w-10 bg-linear-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{cat}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Filters Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  placeholder="Search courses, instructors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition"
              >
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Filters</span>
              </button>
              
              <select
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Sort by: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategory("");
                  setMinPrice("");
                  setMaxPrice("");
                  setSort("");
                  setCurrentPage(1);
                }}
                className="px-4 py-3 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-md hover:shadow-lg"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Course Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
            <p className="mt-2 text-gray-600">Latest picks from our catalog</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Showing {courses.length} of {total}</div>
            <Link href="/courses" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-linear-to-r from-gray-200 to-gray-300" />
                <div className="p-6 space-y-4">
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="h-6 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <div className="text-red-500 text-lg font-semibold">Failed to load courses</div>
            <p className="text-gray-600 mt-2">{message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
            {courses.map((course) => (
              <div key={course._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800">
                      {course.category}
                    </span>
                  </div>
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
                      <Link href={`/courses/${course._id}`}>
                        {course.title}
                      </Link>
                    </h3>
                    <div className="text-2xl font-bold text-indigo-600">${course.price}</div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>1.2k students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>12 hours</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-linear-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                        <span className="font-semibold text-indigo-600">
                          {(course.instructor?.name || "I")[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{course.instructor?.name || "Instructor"}</div>
                        <div className="text-sm text-gray-500">Senior Developer</div>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/courses/${course._id}`}
                      className="px-4 py-2 bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-600 font-medium rounded-lg hover:from-indigo-100 hover:to-purple-100 transition flex items-center gap-2"
                    >
                      Enroll Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && pages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-600">
              Page {page} of {pages} • {total} total courses
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-50 disabled:hover:bg-white transition"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pages) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => goToPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {pages > 5 && (
                <span className="px-2">...</span>
              )}
              
              <button
                disabled={currentPage >= pages}
                onClick={() => goToPage(currentPage + 1)}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-50 disabled:hover:bg-white transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>



      {/* Instructors */}
      <section className="py-16 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Instructors</h2>
            <p className="mt-4 text-gray-600">Industry experts with real-world experience</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {instructors.map((ins) => (
              <div key={ins._id} className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-linear-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-indigo-600">{(ins.name || 'I').split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{ins.name}</div>
                    <div className="text-xs text-gray-500">{ins.email}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>Courses: {ins.courses}</span>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">View Profile</button>
                </div>
              </div>
            ))}
            {instructors.length === 0 && (
              <div className="text-center text-gray-500 col-span-full">No instructors found</div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl overflow-hidden">
            <div className="px-8 py-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start Your Learning Journey Today
              </h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Join thousands of students who have transformed their careers with our courses
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/courses"
                  className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-100 transition shadow-xl hover:shadow-2xl"
                >
                  Browse All Courses
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
