import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDashboardData } from '../../features/dashboard/dashboardSlice';
import Navbar from '../../components/Navbar';
import IssueForm from './IssueForm';

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { fetchUsers } from '../../features/users/userSlice';

const UserDashboard = () => {
    const token = useSelector((state) => state.auth.token);
    const currentUser = useSelector((state) => state.auth.currentUser);

    const dispatch = useDispatch();
    const { projects, issues } = useSelector((state) => state.dashboard);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/dashboard/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                // console.log('Admin Dashboard Data:', data);
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
            dispatch(fetchUsers(token)); // Fetch users when token is available
        }
    }, [dispatch, token]);

    // const matchingIssues = (projectId) => {
    //     return issues.filter(issue => issue.project._id === projectId);
    // }

    const userProjects = projects.filter(project => project.members.some(member => member._id === currentUser.id));
    const userIssues = issues.filter(issue => issue.assignee._id === currentUser.id);
    console.log('User Issues:', userIssues);
    console.log('Current User:', currentUser);
    console.log('User Projects:', userProjects);

    return <div>
        <Navbar />
        {userProjects.map(project => (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                >
                    <Typography component="span">{project.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {project.description}
                    <br />
                    Members: {
                        project.members.map(member => (
                            <span key={member._id}>
                                {member.username}
                                {project.members[project.members.length - 1] !== member ? ', ' : ''}
                            </span>
                        ))
                    }
                    {/* LOGIC TO VIEW ISSUES */}
                    {userIssues.map(issue => (
                        issue.project._id === project._id && <Card key={issue._id} variant='outlined' sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    {issue.title}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {issue.description}
                                </Typography>
                                <Typography variant="body2">
                                    Assigned to: {issue.assignee.username}
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
                    ))}
                </AccordionDetails>

                <AccordionActions>
                    <IssueForm projectId={project._id} />
                </AccordionActions>
            </Accordion>
        ))}
    </div>;
};

export default UserDashboard;
