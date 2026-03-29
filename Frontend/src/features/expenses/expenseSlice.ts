import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../../store';

const API_URL = 'http://localhost:5000/api/expenses';

interface Expense {
  _id: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
}

type SubmitExpenseArg = Omit<Expense, '_id' | 'status' | 'createdAt'>;

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
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

export const submitExpense = createAsyncThunk<Expense, SubmitExpenseArg, { rejectValue: string }>(
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

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchMyExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch expenses';
      })
      .addCase(submitExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.unshift(action.payload);
      })
      .addCase(submitExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to submit expense';
      });
  },
});

export default expenseSlice.reducer;
