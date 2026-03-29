import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button onClick={handleLogout} className="bg-gray-200 text-gray-800 hover:bg-red-500 hover:text-white transition px-4 py-2 rounded font-medium">
          Logout
        </button>
      </div>
      
      <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Welcome back, {userInfo?.name}!</h2>
        <div className="mt-4 flex gap-4">
          <div className="bg-indigo-50 p-4 rounded text-indigo-800 inline-block border border-indigo-100 shadow-sm">
            <span className="text-sm uppercase tracking-wide font-semibold block text-indigo-500">Role</span>
            <span className="text-lg font-bold">{userInfo?.role}</span>
          </div>
          <div className="bg-indigo-50 p-4 rounded text-indigo-800 inline-block border border-indigo-100 shadow-sm">
            <span className="text-sm uppercase tracking-wide font-semibold block text-indigo-500">Email</span>
            <span className="text-lg font-bold">{userInfo?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
