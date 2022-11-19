import { Router } from 'express'
import fcctesting from './fcctesting.cjs'
import { Project, Issue } from '../models/tracker.js'
import checkValidBody from '../middleware/tracker.js'
import { trackerHandler, getAllIssues, updateHandler } from '../controllers/tracker.js'


const issueTracker = Router();

issueTracker.get('/', (req, res) => {
    res.status(200).send('Hello Issue Tracker')
})

issueTracker.get('/api/issues/:project', (req, res, next) => {
    getAllIssues(req, res, next)
})

issueTracker.post('/api/issues/:project', (req, res, next) => {
    trackerHandler(req, res, next)
})

issueTracker.put('/api/issues/:project', checkValidBody, (req, res, next) => {
    updateHandler(req, res, next)
})

issueTracker.delete('/api/issues/:project', async (req, res) => {
    const project_deletions = await Project.deleteMany({})
    const issues_deletions = await Issue.deleteMany({})
    console.log({
        project_deletions,
        issues_deletions
    })
    res.status(204).json({
        project_deletions,
        issues_deletions
    })
})

fcctesting(issueTracker)

export default issueTracker