import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

// Define types
export interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: {
        _id: string;
        name: string;
        email: string;
    };
    price: number;
    category: string;
    tags: string[];
    thumbnail: string;
    syllabus: any[];
    createdAt: string;
}

interface CourseState {
    courses: Course[];
    course: Course | null;
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
    page: number;
    pages: number;
    total: number;
}

const initialState: CourseState = {
    courses: [],
    course: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    page: 1,
    pages: 1,
    total: 0,
};

// Get all courses
export const getCourses = createAsyncThunk(
    'courses/getAll',
    async (params: any = {}, thunkAPI) => {
        try {
            const { search, category, sort, page, minPrice, maxPrice, limit } = params;
            let queryString = '?';
            if (search) queryString += `search=${search}&`;
            if (category) queryString += `category=${category}&`;
            if (sort) queryString += `sort=${sort}&`;
            if (page) queryString += `page=${page}&`;
            if (minPrice !== undefined) queryString += `minPrice=${minPrice}&`;
            if (maxPrice !== undefined) queryString += `maxPrice=${maxPrice}&`;
            if (limit) queryString += `limit=${limit}&`;

            const response = await api.get(`/courses${queryString}`);
            return response.data;
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get course by ID
export const getCourseById = createAsyncThunk(
    'courses/getById',
    async (id: string, thunkAPI) => {
        try {
            const response = await api.get(`/courses/${id}`);
            return response.data;
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCourses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.courses = action.payload.courses;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
                state.total = action.payload.total;
            })
            .addCase(getCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(getCourseById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCourseById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.course = action.payload;
            })
            .addCase(getCourseById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            });
    },
});

export const { reset } = courseSlice.actions;
export default courseSlice.reducer;
