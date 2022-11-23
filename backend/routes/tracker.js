import { Router } from 'express'
import fcctesting from './fcctesting.cjs'
import { validateBody, validateQueries } from '../middleware/tracker.js'
import { allIssues, allProjects, createIssues, updateIssues, deleteIssues } from '../controllers/tracker.js'


const issueTracker = Router();

issueTracker.get('/', (req, res) => {
    res.status(200).send('Hello Issue Tracker')
})

issueTracker.get('/api/projects', allProjects)

issueTracker.get('/api/issues/:project', validateQueries, allIssues)

issueTracker.post('/api/issues/:project', createIssues)

issueTracker.put('/api/issues/:project', validateBody, updateIssues)

issueTracker.delete('/api/issues/:project', validateBody, deleteIssues)

fcctesting(issueTracker)

export default issueTracker