import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitExpense } from '../../features/expenses/expenseSlice';
import type { SubmitExpenseForm } from '../../features/expenses/expenseSlice';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';

const SubmitExpense: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.expenses);

  const [formData, setFormData] = useState<Omit<SubmitExpenseForm, 'amount'> & { amount: string }>({
    amount: '',
    currency: 'USD',
    category: 'Travel',
    description: '',
    receiptUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(submitExpense({
      ...formData,
      amount: parseFloat(formData.amount),
    }));
    if (submitExpense.fulfilled.match(resultAction)) {
      navigate('/my-expenses');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Submit Expense</h1>
        <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900 transition">Dashboard</button>
      </div>

      <div className="bg-white p-8 rounded shadow-lg border border-gray-100">
        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className="mt-1 w-full rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select name="currency" value={formData.currency} onChange={handleChange} className="mt-1 w-full rounded-md border p-2 bg-white focus:ring-indigo-500 outline-none transition">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="INR">INR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="mt-1 w-full rounded-md border p-2 bg-white focus:ring-indigo-500 outline-none transition">
              <option value="Travel">Travel</option>
              <option value="Meals">Meals</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Internet/Phone">Internet/Phone</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 w-full rounded-md border p-2 focus:ring-indigo-500 outline-none transition" required></textarea>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium shadow shadow-indigo-200 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SubmitExpense;
