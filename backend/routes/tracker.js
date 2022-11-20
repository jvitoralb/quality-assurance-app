import { Router } from 'express'
import fcctesting from './fcctesting.cjs'
import checkValidBody, { validateDeletion } from '../middleware/tracker.js'
import {
    createIssues, getAllIssues,
    updateIssues, deleteIssues, getAllProjects
} from '../controllers/tracker.js'


const issueTracker = Router();

issueTracker.get('/', (req, res) => {
    res.status(200).send('Hello Issue Tracker')
})

issueTracker.get('/api/projects', (req, res, next) => {
    getAllProjects(req, res, next)
})

issueTracker.get('/api/issues/:project', (req, res, next) => {
    getAllIssues(req, res, next)
})

issueTracker.post('/api/issues/:project', (req, res, next) => {
    createIssues(req, res, next)
})

issueTracker.put('/api/issues/:project', checkValidBody, (req, res, next) => {
    updateIssues(req, res, next)
})

issueTracker.delete('/api/issues/:project', validateDeletion, (req, res, next) => {
    deleteIssues(req, res, next)
})

fcctesting(issueTracker)

export default issueTracker