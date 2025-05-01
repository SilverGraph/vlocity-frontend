import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { signupUser } from './authAPI';

const initialState = {
    token: localStorage.getItem('token') || null,
    currentUser: localStorage.getItem('currentUser')
        ? JSON.parse(localStorage.getItem('currentUser'))
        : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.currentUser = action.payload.user; // Store user data here
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.token = null;
            state.currentUser = null; // Reset currentUser on logout
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
        },
    },
});

export const register = createAsyncThunk(
    'auth/registerUser',
    async (userData, thunkAPI) => {
        try {
            const response = await signupUser(userData);
            return response; // e.g., { message: 'User registered successfully' }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
