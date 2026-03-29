import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      navigate('/');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 font-bold text-center text-indigo-600">RMS Login</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input 
              type="email" 
              className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-400" 
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full border p-2 rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-400" 
              value={password} 
              onChange={(e)=>setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          New here? <Link to="/signup" className="text-indigo-600 font-medium">Register Company</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
