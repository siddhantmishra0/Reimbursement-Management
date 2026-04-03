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
        <div className="bg-white p-6 rounded shadow border border-gray-100 mb-6">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 mb-4 flex items-center gap-2">
             Admin Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/users" className="border border-slate-200 p-4 rounded-xl flex flex-col justify-between hover:bg-slate-50 hover:border-slate-300 transition group shadow-sm">
              <div>
                <h4 className="font-bold text-slate-800 transition">User Management</h4>
                <p className="text-sm text-slate-500 mt-1">Manage employees and roles</p>
              </div>
              <div className="mt-4 text-right">
                <span className="text-slate-600 group-hover:text-slate-900 font-semibold text-sm transition-colors">Manage Users →</span>
              </div>
            </Link>
            <Link to="/settings" className="border border-indigo-100 bg-indigo-50/30 p-4 rounded-xl flex flex-col justify-between hover:bg-indigo-50 hover:border-indigo-200 transition group shadow-sm">
              <div>
                <h4 className="font-bold text-indigo-900 transition">System Settings</h4>
                <p className="text-sm text-indigo-700 mt-1">Configure automated approval workflows</p>
              </div>
              <div className="mt-4 text-right">
                <span className="text-indigo-600 group-hover:text-indigo-800 font-semibold text-sm transition-colors">Workflow Builder →</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
