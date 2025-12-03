'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Loader2, Plus, Trash } from 'lucide-react';

export default function CreateCourse() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        tags: '',
        thumbnail: '',
    });

    const [syllabus, setSyllabus] = useState([
        { title: '', content: '', duration: 0 },
    ]);

    const [batches, setBatches] = useState([
        { name: '', startDate: '', endDate: '' },
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSyllabusChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newSyllabus: any = [...syllabus];
        newSyllabus[index][e.target.name] = e.target.value;
        setSyllabus(newSyllabus);
    };

    const addModule = () => {
        setSyllabus([...syllabus, { title: '', content: '', duration: 0 }]);
    };

    const removeModule = (index: number) => {
        const newSyllabus = [...syllabus];
        newSyllabus.splice(index, 1);
        setSyllabus(newSyllabus);
    };

    const handleBatchChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newBatches: any = [...batches];
        newBatches[index][e.target.name] = e.target.value;
        setBatches(newBatches);
    };

    const addBatch = () => {
        setBatches([...batches, { name: '', startDate: '', endDate: '' }]);
    };

    const removeBatch = (index: number) => {
        const newBatches = [...batches];
        newBatches.splice(index, 1);
        setBatches(newBatches);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const extractIframeSrc = (val: string) => {
                if (!val) return '';
                const trimmed = val.trim();
                if (!trimmed) return '';
                if (trimmed.startsWith('<iframe')) {
                    const match = trimmed.match(/src\s*=\s*\"([^\"]+)\"/i);
                    return match ? match[1] : '';
                }
                return trimmed;
            };

            const courseData = {
                ...formData,
                price: Number(formData.price),
                tags: formData.tags.split(',').map((tag) => tag.trim()),
                syllabus: syllabus.map(m => ({
                    title: m.title,
                    content: (() => {
                        const src = extractIframeSrc(m.content);
                        return src && src.trim() !== '' ? src.trim() : undefined;
                    })(),
                    duration: Number(m.duration) || undefined,
                })),
                batches: batches.map(b => ({
                    name: b.name,
                    startDate: b.startDate ? new Date(b.startDate).toISOString() : undefined,
                    endDate: b.endDate ? new Date(b.endDate).toISOString() : undefined,
                })),
            };

            await api.post('/courses', courseData);
            router.push('/dashboard/admin');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create course');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['admin', 'instructor']}>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow px-8 py-10">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
                        <nav className="hidden sm:flex items-center gap-2 text-sm">
                            <a href="#basics" className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition">Basics</a>
                            <a href="#syllabus" className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition">Syllabus</a>
                            <a href="#batches" className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition">Batches</a>
                        </nav>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div id="basics">
                            <label className="block text-sm font-medium text-gray-700">Course Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 transition"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 transition"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    step="0.01"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 transition"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 transition"
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                            <input
                                type="text"
                                name="tags"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 transition"
                                placeholder="react, javascript, web"
                                value={formData.tags}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                            <input
                                type="text"
                                name="thumbnail"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 transition"
                                placeholder="https://example.com/image.jpg"
                                value={formData.thumbnail}
                                onChange={handleChange}
                            />
                        </div>

                        <div id="syllabus" className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Syllabus</h3>
                            {syllabus.map((module, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 relative transition hover:shadow-md hover:ring-1 hover:ring-indigo-200">
                                    <button
                                        type="button"
                                        onClick={() => removeModule(index)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition transform hover:scale-105"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Module Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 transition"
                                                value={module.title}
                                                onChange={(e) => handleSyllabusChange(index, e)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Duration (min)</label>
                                            <input
                                                type="number"
                                                name="duration"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 transition"
                                                value={module.duration}
                                                onChange={(e) => handleSyllabusChange(index, e)}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-medium text-gray-500">Video URL</label>
                                            <input
                                                type="text"
                                                name="content"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 transition"
                                                placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                                                value={module.content}
                                                onChange={(e) => handleSyllabusChange(index, e)}
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Enter YouTube or Vimeo video URL
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addModule}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-105"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Module
                            </button>
                        </div>

                        <div id="batches" className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Batches</h3>
                            {batches.map((batch, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 relative transition hover:shadow-md hover:ring-1 hover:ring-indigo-200">
                                    <button
                                        type="button"
                                        onClick={() => removeBatch(index)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition transform hover:scale-105"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Batch Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 transition"
                                                value={batch.name}
                                                onChange={(e) => handleBatchChange(index, e)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">Start Date</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 transition"
                                                value={batch.startDate}
                                                onChange={(e) => handleBatchChange(index, e)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500">End Date</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 transition"
                                                value={batch.endDate}
                                                onChange={(e) => handleBatchChange(index, e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addBatch}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-105"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Batch
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition transform hover:scale-[1.02]"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Course
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
