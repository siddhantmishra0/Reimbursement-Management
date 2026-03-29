import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../store';

const API_URL = 'http://localhost:5000/api/expenses';

export interface Expense {
  _id: string;
  amount: number;
  currency: string;
  convertedAmount?: number;
  exchangeRate?: number;
  category: string;
  description: string;
  receiptUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  currentStepIndex: number;
  approvals: Array<{ approverId: string; action: 'Approved' | 'Rejected'; stepIndex: number; comment?: string; date: string }>;
  employeeId?: { _id: string; name: string; email: string };
}

export interface SubmitExpenseForm {
  amount: number;
  currency: string;
  category: string;
  description: string;
  receiptUrl?: string;
}

interface ExpenseState {
  expenses: Expense[];
  teamExpenses: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  teamExpenses: [],
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

export const fetchMyExpenses = createAsyncThunk<Expense[], void, { rejectValue: string }>(
  'expenses/fetchMyExpenses',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get<Expense[]>(`${API_URL}/my`, config);
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchTeamExpenses = createAsyncThunk<Expense[], void, { rejectValue: string }>(
  'expenses/fetchTeamExpenses',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get<Expense[]>(`${API_URL}/team`, config);
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const submitExpense = createAsyncThunk<Expense, SubmitExpenseForm, { rejectValue: string }>(
  'expenses/submitExpense',
  async (expenseData, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post<Expense>(API_URL, expenseData, config);
      return response.data;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const approveExpense = createAsyncThunk<Expense, { id: string; comment: string }, { rejectValue: string }>(
  'expenses/approveExpense',
  async ({ id, comment }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post<{ expense: Expense }>(`${API_URL}/${id}/approve`, { comment }, config);
      return response.data.expense;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const rejectExpense = createAsyncThunk<Expense, { id: string; comment: string }, { rejectValue: string }>(
  'expenses/rejectExpense',
  async ({ id, comment }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post<{ expense: Expense }>(`${API_URL}/${id}/reject`, { comment }, config);
      return response.data.expense;
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

const updateTeamExpense = (teamExpenses: Expense[], updated: Expense) =>
  teamExpenses.map((e) => (e._id === updated._id ? updated : e));

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // My Expenses
      .addCase(fetchMyExpenses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyExpenses.fulfilled, (state, action) => { state.loading = false; state.expenses = action.payload; })
      .addCase(fetchMyExpenses.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? 'Failed to fetch expenses'; })
      // Team Expenses
      .addCase(fetchTeamExpenses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTeamExpenses.fulfilled, (state, action) => { state.loading = false; state.teamExpenses = action.payload; })
      .addCase(fetchTeamExpenses.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? 'Failed to fetch team expenses'; })
      // Submit
      .addCase(submitExpense.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(submitExpense.fulfilled, (state, action) => { state.loading = false; state.expenses.unshift(action.payload); })
      .addCase(submitExpense.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? 'Failed to submit expense'; })
      // Approve
      .addCase(approveExpense.fulfilled, (state, action) => { state.teamExpenses = updateTeamExpense(state.teamExpenses, action.payload); })
      .addCase(approveExpense.rejected, (state, action) => { state.error = action.payload ?? 'Approval failed'; })
      // Reject
      .addCase(rejectExpense.fulfilled, (state, action) => { state.teamExpenses = updateTeamExpense(state.teamExpenses, action.payload); })
      .addCase(rejectExpense.rejected, (state, action) => { state.error = action.payload ?? 'Rejection failed'; });
  },
});

export default expenseSlice.reducer;
