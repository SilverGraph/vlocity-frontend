// src/features/users/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (token) => {
    try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        return data.filter(user => user.role === 'user');
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;  // This will propagate the error to the Redux error state
    }
});


const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                // console.log('Fetching users...');
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                // console.log('Redux received users:', action.payload);
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default usersSlice.reducer;
