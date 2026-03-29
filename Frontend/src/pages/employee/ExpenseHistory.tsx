import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyExpenses } from '../../features/expenses/expenseSlice';
import type { RootState, AppDispatch } from '../../store';
import { useNavigate } from 'react-router-dom';

const ExpenseHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { expenses, loading, error } = useSelector((state: RootState) => state.expenses);

  useEffect(() => {
    dispatch(fetchMyExpenses());
  }, [dispatch]);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Expenses</h1>
        <div>
          <button onClick={() => navigate('/')} className="mr-4 text-gray-600 hover:text-gray-900 transition">Dashboard</button>
          <button onClick={() => navigate('/submit-expense')} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow shadow-indigo-200 transition font-medium">
            + New Expense
          </button>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 mb-6 rounded shadow-sm">{error}</div>}

      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading expenses...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {expenses.map(exp => (
                  <tr key={exp._id} className="hover:bg-indigo-50/50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(exp.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{exp.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs md:max-w-sm truncate">{exp.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{exp.currency} {exp.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${exp.status === 'Approved' ? 'bg-green-100 text-green-800 border border-green-200' : 
                          exp.status === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No expenses submitted yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseHistory;
