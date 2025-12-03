'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Loader2, Plus, Trash } from 'lucide-react';

export default function EditCourse() {
    const router = useRouter();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        tags: '',
        thumbnail: '',
    });
    const [syllabus, setSyllabus] = useState<any[]>([]);

    useEffect(() => {
        const loadCourse = async () => {
            if (!id) return;
            try {
                const res = await api.get(`/courses/${id}`);
                const c = res.data;
                setFormData({
                    title: c.title || '',
                    description: c.description || '',
                    price: String(c.price ?? ''),
                    category: c.category || '',
                    tags: (c.tags || []).join(','),
                    thumbnail: c.thumbnail || '',
                });
                setSyllabus(c.syllabus || []);
            } catch (error: any) {
                alert(error.response?.data?.message || 'Failed to load course');
            }
        };

        loadCourse();
    }, [id]);

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
                syllabus: syllabus.map((m: any) => ({
                    title: m.title,
                    content: (() => {
                        const src = extractIframeSrc(m.content);
                        return src && src.trim() !== '' ? src.trim() : undefined;
                    })(),
                    duration: Number(m.duration) || undefined,
                })),
            };

            await api.put(`/courses/${id}`, courseData);
            router.push('/dashboard/admin');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to update course');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['admin', 'instructor']}> 
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow px-8 py-10">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Course</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Course Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
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
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
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
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    value={formData.tags}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                                <input
                                    type="text"
                                    name="thumbnail"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    value={formData.thumbnail}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Syllabus</label>
                            <div className="space-y-4">
                                {syllabus.map((module, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Module Title"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                            value={module.title}
                                            onChange={(e) => handleSyllabusChange(index, e)}
                                        />
                                        <input
                                            type="text"
                                            name="content"
                                            placeholder="Content (e.g., video URL)"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                            value={module.content}
                                            onChange={(e) => handleSyllabusChange(index, e)}
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                name="duration"
                                                placeholder="Duration (min)"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                                value={module.duration}
                                                onChange={(e) => handleSyllabusChange(index, e)}
                                            />
                                            <button type="button" onClick={() => removeModule(index)} className="px-3 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100">
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addModule} className="inline-flex items-center px-3 py-2 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                                    <Plus className="h-4 w-4 mr-2" /> Add Module
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                                Update Course
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
