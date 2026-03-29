import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button onClick={handleLogout} className="bg-gray-200 text-gray-800 hover:bg-red-500 hover:text-white transition px-4 py-2 rounded font-medium shadow-sm">
          Logout
        </button>
      </div>
      
      <div className="bg-white p-6 rounded shadow border border-gray-100 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Welcome back, {userInfo?.name}!</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="bg-indigo-50/50 p-4 rounded text-indigo-800 border border-indigo-100">
            <span className="text-sm uppercase tracking-wide font-semibold block text-indigo-500">Role</span>
            <span className="text-lg font-bold">{userInfo?.role}</span>
          </div>
          <div className="bg-indigo-50/50 p-4 rounded text-indigo-800 border border-indigo-100">
            <span className="text-sm uppercase tracking-wide font-semibold block text-indigo-500">Email</span>
            <span className="text-lg font-bold">{userInfo?.email}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow border border-gray-100 flex flex-col items-start justify-between h-full hover:shadow-md transition">
          <div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">My Expenses</h3>
            <p className="text-gray-500 text-sm mb-4">View your expense history and track approval status.</p>
          </div>
          <Link to="/my-expenses" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded hover:from-blue-600 hover:to-indigo-700 transition font-medium shadow-sm w-full text-center">
            View History
          </Link>
        </div>

        <div className="bg-white p-6 rounded shadow border border-gray-100 flex flex-col items-start justify-between h-full hover:shadow-md transition">
          <div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">Submit an Expense</h3>
            <p className="text-gray-500 text-sm mb-4">Upload a receipt and submit a new expense for approval.</p>
          </div>
          <Link to="/submit-expense" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded hover:from-purple-600 hover:to-pink-600 transition font-medium shadow-sm w-full text-center">
            + New Expense
          </Link>
        </div>

        {(userInfo?.role === 'Manager' || userInfo?.role === 'Admin') && (
          <div className="bg-white p-6 rounded shadow border border-gray-100 flex flex-col items-start justify-between h-full hover:shadow-md transition">
            <div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Approval Queue</h3>
              <p className="text-gray-500 text-sm mb-4">Review and action pending expense requests from your team.</p>
            </div>
            <Link to="/approvals" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded hover:from-amber-600 hover:to-orange-600 transition font-medium shadow-sm w-full text-center">
              Review Requests
            </Link>
          </div>
        )}
      </div>

      {userInfo?.role === 'Admin' && (
        <div className="bg-white p-6 rounded shadow border border-gray-100 hover:shadow-md transition">
          <h3 className="text-lg font-bold mb-2 text-gray-800">Admin Controls</h3>
          <p className="text-gray-500 text-sm mb-4">Manage users and permissions across the platform.</p>
          <Link to="/users" className="bg-gray-800 text-white px-5 py-2.5 rounded hover:bg-gray-900 transition font-medium shadow-sm inline-block w-full text-center">
            Manage Users
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
