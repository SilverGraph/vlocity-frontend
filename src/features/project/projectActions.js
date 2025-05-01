export const createProject = (projectData) => async (dispatch, getState) => {
    try {
        // Get token from current user in Redux store
        const token = getState().auth.token;

        // Prepare the request
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(projectData),
        });

        const data = await response.json();

        if (response.ok) {
            dispatch({
                type: 'CREATE_PROJECT_SUCCESS',
                payload: data,
            });

            // Optionally, you can also redirect or show a success message here
        } else {
            dispatch({
                type: 'CREATE_PROJECT_FAILED',
                payload: data.message,
            });
        }
    } catch (error) {
        dispatch({
            type: 'CREATE_PROJECT_FAILED',
            payload: error.message,
        });
    }
};
