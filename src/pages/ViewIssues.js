import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, FormControl, InputLabel, Select,
    MenuItem, Button, Card, CardContent, Typography
} from '@mui/material';
import Navbar from '../components/Navbar';
import { fetchUsers } from '../features/users/userSlice';
import { setDashboardData } from '../features/dashboard/dashboardSlice';

const ViewIssues = () => {
    const dispatch = useDispatch();
    const { issues } = useSelector((state) => state.dashboard);
    const { users } = useSelector((state) => state.users);
    const token = useSelector((state) => state.auth.token);

    const [filter, setFilter] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [showIssues, setShowIssues] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/dashboard/admin', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    dispatch(setDashboardData(data));

                } else {
                    console.error('Failed to fetch dashboard data:', data.message);
                }
            } catch (error) {
                console.error('Failed to fetch admin dashboard data:', error);
            }
        };
        if (token) {
            fetchDashboardData();
            dispatch(fetchUsers(token));
        }
    }, [dispatch, token]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setFilterValue('');
    };

    const handleValueChange = (event) => {
        setFilterValue(event.target.value);
    };

    const getFilterOptions = () => {
        if (filter === 'status') return ['Open', 'In Progress', 'Closed'];
        if (filter === 'priority') return ['Low', 'Medium', 'High'];
        if (filter === 'assignee') return users.map((user) => user.username);
        return [];
    };

    return (
        <div>
            <Navbar />
            <Box sx={{ m: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Filter issues by</InputLabel>
                    <Select value={filter} label="Filter issues by" onChange={handleFilterChange}>
                        <MenuItem value="assignee">Assignee</MenuItem>
                        <MenuItem value="priority">Priority</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                    </Select>
                </FormControl>

                {filter && (
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>{`Select ${filter}`}</InputLabel>
                        <Select value={filterValue} label={`Select ${filter}`} onChange={handleValueChange}>
                            {getFilterOptions().map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <Button onClick={() => {
                    console.log(filter, filterValue, issues)
                    console.log(users.find(user => user.username === filterValue))
                    setShowIssues(true);
                }}>Apply</Button>

                {showIssues && (
                    issues.map(issue => {
                        let query;
                        if (filter === 'assignee')
                            query = issue[filter]?._id === users.find(user => user.username === filterValue)._id
                        else
                            query = issue[filter] === filterValue
                        if (query) {
                            console.log("Issue:", issue)
                            return (
                                <Card variant='outlined' sx={{ minWidth: 275 }}>
                                    <CardContent>
                                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                            {issue.title}
                                        </Typography>
                                        <Typography variant="h5" component="div">
                                            {issue.description}
                                        </Typography>
                                        <Typography variant="body2">
                                            Assigned to: {issue.assignee?.username}
                                            <br />
                                            Status: {issue.status}
                                            <br />
                                            Priority: {issue.priority}
                                            <br />
                                            Created by: {issue.createdBy}
                                            <br />
                                            Created for project: {issue.project.name}
                                            <br />
                                            Created at time: {issue.createdAt}
                                            <br />
                                            Last updated: {issue.updatedAt}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            );
                        }
                        return null;
                    })
                )}
            </Box>
        </div>
    );
};

export default ViewIssues;
