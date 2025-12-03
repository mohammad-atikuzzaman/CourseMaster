import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { Course } from '../courses/courseSlice';

// Define types
export interface Enrollment {
    _id: string;
    student: string;
    course: Course;
    progress: number;
    completedLessons: string[];
    status: 'active' | 'completed' | 'dropped';
    createdAt: string;
}

interface EnrollmentState {
    enrollments: Enrollment[];
    currentEnrollment: Enrollment | null;
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
}

const initialState: EnrollmentState = {
    enrollments: [],
    currentEnrollment: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Enroll in a course
export const enrollCourse = createAsyncThunk(
    'enrollments/enroll',
    async (courseId: string, thunkAPI) => {
        try {
            const response = await api.post('/enrollments', { courseId });
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

// Get my enrollments
export const getMyEnrollments = createAsyncThunk(
    'enrollments/getMy',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/enrollments/my-courses');
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

export const enrollmentSlice = createSlice({
    name: 'enrollment',
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
            .addCase(enrollCourse.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(enrollCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.enrollments.push(action.payload);
            })
            .addCase(enrollCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(getMyEnrollments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyEnrollments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.enrollments = action.payload;
            })
            .addCase(getMyEnrollments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            });
    },
});

export const { reset } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
