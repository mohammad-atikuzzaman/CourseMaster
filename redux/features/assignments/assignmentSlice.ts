import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface Assignment {
  _id: string;
  title: string;
  description?: string;
  course: string;
  moduleIndex?: number;
  dueDate?: string;
  type: 'assignment' | 'quiz';
}

export interface Submission {
  _id: string;
  assignment: string;
  student: string;
  content?: string;
  repoUrl?: string;
  deploymentUrl?: string;
  score?: number;
  status: 'submitted' | 'graded';
  createdAt: string;
}

interface AssignmentState {
  assignments: Assignment[];
  submissions: Submission[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: AssignmentState = {
  assignments: [],
  submissions: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getCourseAssignments = createAsyncThunk(
  'assignments/getCourse',
  async (courseId: string, thunkAPI) => {
    try {
      const res = await api.get(`/assignments/course/${courseId}`);
      return res.data as Assignment[];
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createAssignment = createAsyncThunk(
  'assignments/create',
  async (
    data: { courseId: string; title: string; description?: string; dueDate?: string; moduleIndex?: number },
    thunkAPI
  ) => {
    try {
      const res = await api.post('/assignments', data);
      return res.data as Assignment;
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const submitAssignment = createAsyncThunk(
  'assignments/submit',
  async (
    data: { assignmentId: string; repoUrl?: string; deploymentUrl?: string; content?: string },
    thunkAPI
  ) => {
    try {
      const { assignmentId, ...payload } = data;
      const res = await api.post(`/assignments/${assignmentId}/submit`, payload);
      return res.data as Submission;
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSubmissions = createAsyncThunk(
  'assignments/getSubmissions',
  async (assignmentId: string, thunkAPI) => {
    try {
      const res = await api.get(`/assignments/${assignmentId}/submissions`);
      return res.data as Submission[];
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMySubmissionsByCourse = createAsyncThunk(
  'assignments/getMyByCourse',
  async (courseId: string, thunkAPI) => {
    try {
      const res = await api.get(`/assignments/course/${courseId}/my-submissions`);
      return res.data as Submission[];
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const gradeSubmission = createAsyncThunk(
  'assignments/grade',
  async (
    data: { assignmentId: string; submissionId: string; score: number; status?: 'graded' | 'submitted' },
    thunkAPI
  ) => {
    try {
      const { assignmentId, submissionId, ...payload } = data;
      const res = await api.put(`/assignments/${assignmentId}/grade/${submissionId}`, payload);
      return res.data as Submission;
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const assignmentSlice = createSlice({
  name: 'assignments',
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
      .addCase(getCourseAssignments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCourseAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.assignments = action.payload;
      })
      .addCase(getCourseAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.assignments.push(action.payload);
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.submissions.push(action.payload);
      })
      .addCase(getSubmissions.fulfilled, (state, action) => {
        state.submissions = action.payload;
      })
      .addCase(getMySubmissionsByCourse.fulfilled, (state, action) => {
        state.submissions = action.payload;
      })
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        const idx = state.submissions.findIndex(s => s._id === action.payload._id);
        if (idx !== -1) state.submissions[idx] = action.payload;
      });
  },
});

export const { reset } = assignmentSlice.actions;
export default assignmentSlice.reducer;
