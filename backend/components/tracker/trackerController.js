import IssuesTracker from './trackerService.js'
import CustomError from '../../errors/custom.js'
import pathFrontend from '../../configs/pathConfig.js'
import connect from './connection.js'


export const getTrackerHome = (req, res, next) => {
    res.status(200).sendFile(`${pathFrontend}/public/tracker.html`)
}

export const getAllProjects = async (req, res, next) => {
    const trackerRef = new IssuesTracker()

    try {
        await connect()
        await trackerRef.projectFindAll()
        res.status(200).json(trackerRef.docProject)
    } catch(err) {
        next(err)
    }
}

export const deleteProject = async (req, res, next) => {
    const { project } = req.params
    const trackerRef = new IssuesTracker({}, { name: project })

    try {
        await connect()
        await trackerRef.projectDelete()
        res.status(200).json({
            result: 'successfully deleted',
            name: trackerRef.docProject.name
        })
    } catch(err) {
        next(err)
    }
}

export const createIssues = async (req, res, next) => {
    const { params, body: { project_name, ...rest } } = req
    const trackerRef = new IssuesTracker(rest, { name: params.project })

    try {
        await connect()
        await trackerRef.projectSave()
        await trackerRef.issueSave()
        res.status(201).json(trackerRef.docIssue)
    } catch(err) {
        next(err)
    }
}

export const getAllIssues = async (req, res, next) => {
    const { params, query } = req
    const trackerRef = new IssuesTracker({}, { name: params.project })

    try {
        await connect()
        await trackerRef.projectFindIssues(query)

        if (!trackerRef.docProject.issues.length) {
            throw new CustomError('no issues found', 200, { name: trackerRef.docProject.name })
        }

        res.status(200).json(trackerRef.docProject)
    } catch(err) {
        next(err)
    }
}

export const updateIssues = async (req, res, next) => {
    const { params, body: { issue_id, ...rest } } = req
    const trackerRef = new IssuesTracker({ _id: issue_id, ...rest }, { name: params.project })

    try {
        await connect()
        await trackerRef.issueUpdate()
        res.status(200).json({
            result: 'successfully updated',
            _id: trackerRef.docIssue._id
        })
    } catch(err) {
        next(err)
    }
}

export const deleteIssues = async (req, res, next) => {
    const { params, body: { issue_id } } = req
    const trackerRef = new IssuesTracker({ _id: issue_id }, { name: params.project })

    try {
        await connect()
        await trackerRef.issueDelete()
        res.status(200).json({
            result: 'successfully deleted',
            _id: trackerRef.docIssue._id
        })
    } catch(err) {
        next(err)
    }
}