import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './pages/admin/UserManagement';
import SubmitExpense from './pages/employee/SubmitExpense';
import ExpenseHistory from './pages/employee/ExpenseHistory';
import Approvals from './pages/manager/Approvals';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/submit-expense" element={<SubmitExpense />} />
            <Route path="/my-expenses" element={<ExpenseHistory />} />
            <Route path="/approvals" element={<Approvals />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
