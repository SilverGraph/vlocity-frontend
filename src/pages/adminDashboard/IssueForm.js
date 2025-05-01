import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
    Box, TextField, Select, MenuItem, Modal,
    InputLabel, FormControl, Button, Typography
} from '@mui/material';
import { addIssue } from '../../features/dashboard/dashboardSlice';

const IssueForm = ({ projectId }) => {
    const dispatch = useDispatch();

    // STATE FOR MODAL
    const [createIssue, setCreateIssue] = React.useState(false);
    const handleOpenCreateIssues = () => setCreateIssue(true);
    const handleCloseCreateIssues = () => setCreateIssue(false);

    // STATE FOR FORM
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Low');
    const [status, setStatus] = useState('Open');
    const [assignee, setAssignee] = useState('');
    const { users } = useSelector((state) => state.users);
    const currentUser = useSelector((state) => state.auth.currentUser);
    const token = useSelector((state) => state.auth.token);

    // LOGIC TO HANDLE FORM SUBMISSION
    const handleSubmit = async (e) => {
        e.preventDefault();
        const issueData = { title, description, priority, status, assignee, project: projectId };

        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL + `/issues`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(issueData),
            });

            const data = await response.json();
            if (response.ok) {
                dispatch(addIssue(data))
                // console.log('Issue created:', data);
                setTitle('');
                setDescription('');
                setPriority('Low');
                setStatus('Open');
                setAssignee('');
            } else {
                console.error('Error:', data.message);
            }
        } catch (err) {
            console.error('Failed to create issue:', err.message);
        }
    };

    return (
        <div>
            {currentUser.role === "admin" && <Button onClick={handleOpenCreateIssues}>Create Issue</Button>}
            <Modal
                open={createIssue}
                onClose={handleCloseCreateIssues}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box component="form" onSubmit={handleSubmit} sx={{ background: 'white', display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                    <Typography variant="h6">Create New Issue</Typography>

                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={4}
                        required
                    />

                    <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select value={priority} onChange={(e) => setPriority(e.target.value)} label="Priority">
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                            <MenuItem value="Open">Open</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Closed">Closed</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth required>
                        <InputLabel>Assign To</InputLabel>
                        <Select value={assignee} onChange={(e) => setAssignee(e.target.value)} label="Assign To">
                            {users.map((user) => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button variant="contained" type="submit">Create Issue</Button>
                </Box>
            </Modal>
        </div>
    )
}

export default IssueForm;