import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import userReducer from './features/users/userSlice';
import expenseReducer from './features/expenses/expenseSlice';
import approvalFlowReducer from './features/approvalFlows/approvalFlowSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    expenses: expenseReducer,
    approvalFlows: approvalFlowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
