const API_URL = process.env.REACT_APP_API_BASE_URL + '/auth'; // Change this if needed

// Login user
export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error('Failed to log in');
    }

    return response.json();
};

// Sign up user
export const signupUser = async (data) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to register');
    }

    return response.json();
};
