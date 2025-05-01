import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, MenuItem, FormControl, InputLabel, Select, OutlinedInput } from '@mui/material';
import { createProject } from '../../features/project/projectActions';
import { fetchUsers } from '../../features/users/userSlice';

const ProjectForm = () => {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedUser, setSelectedUser] = useState([]);
    const [error, setError] = useState('');

    const dispatch = useDispatch();

    // Get current user from Redux
    const currentUser = useSelector((state) => state.auth.currentUser);
    const users = useSelector((state) => state.users.users);  // Adjusted for your slice

    useEffect(() => {
        // Fetch users when component mounts
        if (currentUser) {
            dispatch(fetchUsers(currentUser.token)); // Pass token to fetch users
        }
    }, [dispatch, currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!projectName || !description || !selectedUser) {
            setError('Please fill all fields');
            return;
        }

        // Dispatch create project action
        dispatch(createProject({
            name: projectName,
            description,
            createdBy: currentUser.id,
            members: selectedUser,
        }));
    };

    // console.log(currentUser);

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Project Name"
                fullWidth
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                margin="normal"
            />
            <TextField
                label="Description"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="normal"
            />

            <FormControl fullWidth margin="normal">
                <InputLabel>Assign User</InputLabel>
                <Select
                    multiple
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    // label="Assign User"
                    input={<OutlinedInput label="Assign User" />}
                >
                    {/* {loading ? (
                        <MenuItem disabled>
                            <CircularProgress size={24} />
                        </MenuItem>
                    ) : (
                        users.map((user) => {
                            // console.log(user, currentUser);
                            return <MenuItem key={user._id} value={user._id}>
                                {user.username}
                            </MenuItem>
                        })
                    )} */}
                    {
                        users.map((user) => {
                            // console.log(user, currentUser);
                            return <MenuItem key={user._id} value={user._id}>
                                {user.username}
                            </MenuItem>
                        })
                    }
                </Select>
            </FormControl>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Button type="submit" variant="contained" color="primary" fullWidth>
                Create Project
            </Button>
        </form>
    );
};

export default ProjectForm;
