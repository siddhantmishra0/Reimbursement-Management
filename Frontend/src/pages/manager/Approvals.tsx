import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import { fetchTeamExpenses, approveExpense, rejectExpense } from '../../features/expenses/expenseSlice';
import ManagerApprovalPanel from '../../components/ManagerApprovalPanel';
import type { Expense } from '../../features/expenses/expenseSlice';

const Approvals: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { teamExpenses, loading, error } = useSelector((state: RootState) => state.expenses);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (userInfo && (userInfo.role === 'Manager' || userInfo.role === 'Admin')) {
      dispatch(fetchTeamExpenses());
    } else {
      navigate('/');
    }
  }, [dispatch, userInfo, navigate]);

  const pendingExpenses: Expense[] = teamExpenses
    .filter(e => e.status === 'Pending')
    .map(e => ({
      ...e,
      employeeName: (e.employeeId as any)?.name ?? 'Unknown',
    }));

  const handleApprove = (id: string, comment: string) => {
    dispatch(approveExpense({ id, comment }));
  };

  const handleReject = (id: string, comment: string) => {
    dispatch(rejectExpense({ id, comment }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Approval Queue</h1>
            <p className="text-gray-500 text-sm mt-1">Review and action pending expense requests from your team.</p>
          </div>
          <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900 text-sm font-medium transition px-4 py-2 rounded-lg hover:bg-gray-100">
            ← Dashboard
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-xl text-sm">{error}</div>
        )}

        <ManagerApprovalPanel
          expenses={pendingExpenses}
          onApprove={handleApprove}
          onReject={handleReject}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default Approvals;
