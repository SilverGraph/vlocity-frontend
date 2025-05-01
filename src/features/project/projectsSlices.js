import { createSlice } from '@reduxjs/toolkit';

const projectsSlice = createSlice({
    name: 'projects',
    initialState: {
        projects: [],
        loading: false,
        error: null,
    },
    reducers: {
        // You can handle success or failure of the project creation here
        CREATE_PROJECT_SUCCESS: (state, action) => {
            state.projects.push(action.payload); // Add newly created project to state
            state.loading = false;
        },
        CREATE_PROJECT_FAILED: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { CREATE_PROJECT_SUCCESS, CREATE_PROJECT_FAILED } = projectsSlice.actions;

export default projectsSlice.reducer;
