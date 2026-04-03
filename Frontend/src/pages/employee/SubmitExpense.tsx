import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitExpense } from '../../features/expenses/expenseSlice';
import type { SubmitExpenseForm } from '../../features/expenses/expenseSlice';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import axios from 'axios';

const SubmitExpense: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.expenses);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<Omit<SubmitExpenseForm, 'amount'> & { amount: string }>({
    amount: '',
    currency: 'USD',
    category: 'Travel',
    description: '',
    receiptUrl: ''
  });

  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    setOcrError('');

    try {
      const uploadData = new FormData();
      uploadData.append('receipt', file);

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/expenses/extract-receipt`, uploadData, config);
      
      setFormData(prev => ({
        ...prev,
        amount: data.amount ? data.amount.toString() : prev.amount,
        description: data.description ? data.description : prev.description,
        receiptUrl: data.receiptUrl,
      }));
    } catch (err: any) {
      console.error(err);
      setOcrError(err.response?.data?.message || 'Failed to scan receipt with OCR.');
    } finally {
      setOcrLoading(false);
    }
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
        {ocrError && <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 mb-4 rounded">{ocrError}</div>}
        
        <div className="mb-6 p-4 border-2 border-dashed border-indigo-200 rounded-lg bg-indigo-50/50">
          <label className="block text-sm font-semibold text-indigo-900 mb-2">Upload Receipt (OCR Auto-fill)</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            disabled={ocrLoading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-600 file:text-white
              hover:file:bg-indigo-700
              disabled:opacity-50 transition"
          />
          {ocrLoading && <p className="text-sm text-indigo-600 mt-2 flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Scanning receipt...
          </p>}
          {formData.receiptUrl && !ocrLoading && <p className="text-sm text-green-600 mt-2 font-medium">✓ Receipt uploaded and scanned</p>}
        </div>

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
            <button type="submit" disabled={loading || ocrLoading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium shadow shadow-indigo-200 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SubmitExpense;
