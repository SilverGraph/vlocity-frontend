import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoutes';  // Assume you have a ProtectedRoute component
import AdminDashboard from './pages/adminDashboard/AdminDashboard';
import { useSelector } from 'react-redux';
import UserDashboard from './pages/adminDashboard/UserDashboard';
import ViewIssues from './pages/ViewIssues';

const App = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Navigate to="/login" />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={currentUser?.role === "admin" ? <AdminDashboard /> : <UserDashboard />} />}
        />
        <Route
          path="/issues"
          element={<ProtectedRoute element={<ViewIssues />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
