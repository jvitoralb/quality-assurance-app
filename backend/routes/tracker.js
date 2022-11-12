import { Router } from 'express'
import fcctesting from './fcctesting.cjs'
import { Project } from '../models/tracker.js';


const issueTracker = Router();

issueTracker.get('/', (req, res) => {
    res.status(200).send('Hello Issue Tracker')
})

issueTracker.get('/api/issues/:project', (req, res) => {
    // Get all issues on a project
    res.status(200).send(`Project Name: ${req.params.project}`)
    // add filter to the project - can use a middleware - can have multiple filters
})

issueTracker.post('/api/issues/:project', (req, res) => {
    const saveDoc = async () => {
        const { project_name } = req.body
        try {
            const saved = await new Project({
                name: project_name
            }).save()
            return saved
        } catch(err) {
            console.log(err, '<--- Save doc err ---')
        }
    }
    const result = saveDoc()
    res.status(201).json({
        project: result.name,
        ...req.body
    })
})

issueTracker.put('/api/issues/:project', (req, res) => {
    //update multiple fields 
    // update issue with missing _id (??)
    // update issue with no fields to update (??)
    // update issue with invalid _id (??)
    res.status(201).json({
        ...req.body
    })
})

issueTracker.delete('/api/issues/:project', (req, res) => {
    //delete issue with invalid _id (??)
    //delete issue with missing _id (??)
    res.status(204).json({
        issue_deleted: req.body.project
    })
})

fcctesting(issueTracker)

export default issueTracker