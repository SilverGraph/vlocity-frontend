import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import userReducer from '../features/users/userSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        users: userReducer
    },
});

export default store;