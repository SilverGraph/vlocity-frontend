// redux/slices/dashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        projects: [],
        issues: [],
    },
    reducers: {
        setDashboardData: (state, action) => {
            state.projects = action.payload.projects;
            state.issues = action.payload.issues;
        },
        clearDashboardData: (state) => {
            state.projects = [];
            state.issues = [];
        },
        addIssue: (state, action) => {
            state.issues.push(action.payload);
        }
    },
});

export const { setDashboardData, clearDashboardData, addIssue } = dashboardSlice.actions;
export default dashboardSlice.reducer;
