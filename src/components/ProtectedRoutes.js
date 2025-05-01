import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, ...rest }) => {
    const token = useSelector(state => state.auth.token);  // Assuming the token is stored in Redux

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return element;
};

export default ProtectedRoute;