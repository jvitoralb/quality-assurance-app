import { Router } from 'express';
import fcctesting from '../../routes/fcctesting.cjs';
import { validateBody, validateQueries } from './trackerMiddleware.js';
import {
    getTrackerHome,
    getAllIssues,
    getAllProjects,
    createIssues,
    updateIssues,
    deleteIssues,
    deleteProject
} from './trackerController.js';


const issueTracker = Router();

issueTracker.route('/')
.get(getTrackerHome);

issueTracker.route('/api/v1/projects')
.get(getAllProjects);

issueTracker.route('/api/v1/projects/:project')
.delete(deleteProject);

issueTracker.route('/api/v1/issues/:project')
.get(validateQueries, getAllIssues)
.post(createIssues)
.put(validateBody, updateIssues)
.delete(validateBody, deleteIssues);

fcctesting(issueTracker);

export default issueTracker;