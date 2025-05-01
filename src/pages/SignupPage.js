import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../features/auth/authSlice';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Box,
    Alert,
} from '@mui/material';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'user',
    });
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 'admin' : 'user') : value,
        }));
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(register(formData)).unwrap();
            alert('Registration successful. Redirecting to log in.');
            navigate("/login")
        } catch (err) {
            setError(err?.message || 'Registration failed.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        margin="normal"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="role"
                                checked={formData.role === 'admin'}
                                onChange={handleChange}
                            />
                        }
                        label="Register as Admin"
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box mt={3}>
                        <Button type="submit" variant="contained" fullWidth>
                            Register
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default RegisterForm;
