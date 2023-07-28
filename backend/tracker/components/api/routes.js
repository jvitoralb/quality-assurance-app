import { Router } from 'express';
// import fcctesting from '../../../fcctesting.cjs';
import { errorHandler, validateBody, validateQueries } from './middlewares.js';
import {
    getAllIssues,
    getAllProjects,
    createIssues,
    updateIssues,
    deleteIssues,
    deleteProject
} from './controllers.js';


const issueTracker = Router();

issueTracker.route('/api/v1/projects')
.get(getAllProjects);

issueTracker.route('/api/v1/projects/:project')
.delete(deleteProject);

issueTracker.route('/api/v1/issues/:project')
.get(validateQueries, getAllIssues)
.post(createIssues)
.put(validateBody, updateIssues)
.delete(validateBody, deleteIssues);

issueTracker.use(errorHandler);

// fcctesting(issueTracker);

export default issueTracker;