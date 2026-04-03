import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
  token: string;
}

interface AuthState {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
}

const userInfoString = localStorage.getItem('userInfo');
const initialState: AuthState = {
  userInfo: userInfoString ? JSON.parse(userInfoString) : null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials: any, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data) {
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const signup = createAsyncThunk('auth/signup', async (data: any, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, data);
    if (response.data) {
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
