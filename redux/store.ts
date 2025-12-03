import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import courseReducer from './features/courses/courseSlice';
import enrollmentReducer from './features/enrollments/enrollmentSlice';
import assignmentReducer from './features/assignments/assignmentSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        enrollment: enrollmentReducer,
        assignments: assignmentReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
