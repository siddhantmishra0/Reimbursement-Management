import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../store';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/approval-flows`;

export interface ApprovalStep {
  _id?: string;
  stepName: string;
  ruleType: 'Sequential' | 'Percentage' | 'SpecificApprover' | 'Hybrid';
  requiredRole: 'Manager' | 'Admin' | 'Employee' | 'Any';
  percentageRequired?: number;
  specificApproverId?: { _id: string; name: string; email: string } | string;
}

export interface ApprovalFlow {
  _id: string;
  companyId: string;
  name: string;
  isDefault: boolean;
  steps: ApprovalStep[];
  createdAt: string;
  updatedAt: string;
}

interface ApprovalFlowState {
  flows: ApprovalFlow[];
  loading: boolean;
  error: string | null;
}

const initialState: ApprovalFlowState = {
  flows: [],
  loading: false,
  error: null,
};

const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unknown error occurred';
};

export const fetchApprovalFlows = createAsyncThunk<ApprovalFlow[], void, { rejectValue: string }>(
  'approvalFlows/fetch',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const config = { headers: { Authorization: `Bearer ${state.auth.userInfo?.token}` } };
      const response = await axios.get<ApprovalFlow[]>(API_URL, config);
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const createApprovalFlow = createAsyncThunk<ApprovalFlow, Partial<ApprovalFlow>, { rejectValue: string }>(
  'approvalFlows/create',
  async (flowData, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const config = { headers: { Authorization: `Bearer ${state.auth.userInfo?.token}` } };
      const response = await axios.post<ApprovalFlow>(API_URL, flowData, config);
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const updateApprovalFlow = createAsyncThunk<ApprovalFlow, { id: string; data: Partial<ApprovalFlow> }, { rejectValue: string }>(
  'approvalFlows/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const config = { headers: { Authorization: `Bearer ${state.auth.userInfo?.token}` } };
      const response = await axios.put<ApprovalFlow>(`${API_URL}/${id}`, data, config);
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const deleteApprovalFlow = createAsyncThunk<string, string, { rejectValue: string }>(
  'approvalFlows/delete',
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const config = { headers: { Authorization: `Bearer ${state.auth.userInfo?.token}` } };
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

const approvalFlowSlice = createSlice({
  name: 'approvalFlows',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchApprovalFlows.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchApprovalFlows.fulfilled, (state, action) => { state.loading = false; state.flows = action.payload; })
      .addCase(fetchApprovalFlows.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? 'Failed to fetch flows'; })
      // Create
      .addCase(createApprovalFlow.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createApprovalFlow.fulfilled, (state, action) => {
        state.loading = false;
        // If the new one is default, unset others in state
        if (action.payload.isDefault) {
          state.flows.forEach(f => f.isDefault = false);
        }
        state.flows.push(action.payload);
      })
      .addCase(createApprovalFlow.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? 'Failed to create flow'; })
      // Update
      .addCase(updateApprovalFlow.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateApprovalFlow.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isDefault) {
          state.flows.forEach(f => f.isDefault = false);
        }
        const index = state.flows.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.flows[index] = action.payload;
        }
      })
      .addCase(updateApprovalFlow.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? 'Failed to update flow'; })
      // Delete
      .addCase(deleteApprovalFlow.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteApprovalFlow.fulfilled, (state, action) => {
        state.loading = false;
        state.flows = state.flows.filter(f => f._id !== action.payload);
      })
      .addCase(deleteApprovalFlow.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? 'Failed to delete flow'; });
  },
});

export default approvalFlowSlice.reducer;
