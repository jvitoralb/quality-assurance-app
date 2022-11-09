import { Router } from 'express'
import fcctesting from './fcctesting.cjs'


const issueTracker = Router();

issueTracker.get('/', (req, res) => {
    res.status(200).send('Hello Issue Tracker')
})

fcctesting(issueTracker)

export default issueTracker