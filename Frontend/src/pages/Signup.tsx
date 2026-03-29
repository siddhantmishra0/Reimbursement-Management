import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store';

const Signup: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [country, setCountry] = useState('USA');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(signup({ 
      companyName, baseCurrency, country, adminName, adminEmail, adminPassword 
    }));
    if (signup.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4 font-bold text-center text-indigo-600">Register Company</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700">Company Name</label>
            <input type="text" className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-400" value={companyName} onChange={e=>setCompanyName(e.target.value)} required />
          </div>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-gray-700">Currency</label>
              <input type="text" className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-400" value={baseCurrency} onChange={e=>setBaseCurrency(e.target.value)} required />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">Country</label>
              <input type="text" className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-400" value={country} onChange={e=>setCountry(e.target.value)} required />
            </div>
          </div>
          <hr className="my-6 border-gray-200" />
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Admin User Detail</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input type="text" className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-400" value={adminName} onChange={e=>setAdminName(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input type="email" className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-400" value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input type="password" className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-400" value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};
export default Signup;
