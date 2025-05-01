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
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import ProjectForm from './ProjectForm';
import { fetchUsers } from '../../features/users/userSlice';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const AdminDashboard = () => {
    const token = useSelector((state) => state.auth.token);

    // STATE FOR CREATING PROJECTS
    const [createProject, setCreateProject] = React.useState(false);
    const handleOpenCreateProject = () => setCreateProject(true);
    const handleCloseCreateProject = () => setCreateProject(false);

    const dispatch = useDispatch();
    const { projects, issues } = useSelector((state) => state.dashboard);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/dashboard/admin', {
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

    const matchingIssues = (projectId) => {
        return issues.filter(issue => issue.project._id === projectId);
    }

    return <div>
        <Navbar />
        {/* LOGIC TO CREATE PROJECTS */}
        <div>
            <Button onClick={handleOpenCreateProject}>+ Create Project</Button>
            <Modal
                open={createProject}
                onClose={handleCloseCreateProject}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    Create Project Form
                    <ProjectForm />
                </Box>
            </Modal>
        </div>

        {projects.map(project => (
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
                    {matchingIssues(project._id).map(issue => (
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
                    ))}
                </AccordionDetails>

                <AccordionActions>
                    <IssueForm projectId={project._id} />
                </AccordionActions>
            </Accordion>
        ))}
    </div>;
};

export default AdminDashboard;
