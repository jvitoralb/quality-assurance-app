import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { Project, Issue } from '../models/tracker.js'
import CustomError from '../errors/custom.js'


class IssuesTracker {
    constructor(docIssue, docProject) {
        this.docIssue = docIssue
        this.docProject = docProject
    }

    issueDelete = async () => {
        let deleted = await Issue.findByIdAndDelete(this.docIssue._id)

        if (!deleted) {
            throw new CustomError('could not delete', 400, { _id: this.docIssue._id })
        }

        this.docIssue = deleted
        await this.projectUpdate(true)
    }

    projectFindIssues = async (filters) => {
        let found = await Project.findOne({ name: this.docProject.name }, '-__v')
        .populate({
            path: 'issues',
            select: '-__v -project',
            match: filters || null
        })

        if (!found) {
            throw new CustomError('could not find project', 400, { name: this.docProject.name })
        }

        this.docProject = found
    }

    projectFindAll = async () => {
        let allProjects = await Project.find({}, '-__v')

        if (!allProjects.length) {
            throw new CustomError('no projects found', 200)
        }

        this.docProject = allProjects
    }

    projectUpdate = async (remove) => {
        this.docProject = await Project.findOneAndUpdate({ name: this.docProject.name }, {
            [remove ? '$pull' : '$push']: {
                issues: ObjectId(this.docIssue._id)
            }
        }, { new: true })

        if (!this.docProject) {
            throw new CustomError(`could not update project`, 400, { name: this.docProject.name })
        }
    }

    issueUpdate = async () => {
        const { project_name, _id, ...update } = this.docIssue

        try {
            this.docIssue = await Issue.findByIdAndUpdate(_id, {
                $set: {
                    ...update,
                    updated_on: new Date()
                }
            }, { new: true, select: '-__v' })

            if (!this.docIssue) {
                throw new CustomError(`could not update`, 400, { _id })
            }
        } catch(err) {
            if (err.name === 'CastError') {
                throw new CustomError(`could not update`, 400, { _id })
            }
            throw err
        }
    }

    issueSave = async () => {
        const newIssue = new Issue({
            ...this.docIssue,
            _id: new mongoose.Types.ObjectId,
            project: this.docProject._id,
            created_on: new Date(),
            updated_on: new Date()
        })

        try {
            this.docIssue = await newIssue.save()
            await this.projectUpdate()
        } catch(err) {
            if (err.name === 'ValidationError') {
                throw new CustomError('required field(s) missing', 400)
            }
            throw err
        }
    }

    projectSave = async () => {
        const newProject = new Project(this.docProject)

        try {
            this.docProject = await newProject.save()
        } catch(err) {
            if (err.code === 11000) {
                await this.projectFindIssues()
                return
            }
            throw err
        }
    }
}

export const allProjects = async (req, res, next) => {
    const trackerRef = new IssuesTracker()

    try {
        await trackerRef.projectFindAll()
        res.status(200).json(trackerRef.docProject)
    } catch(err) {
        next(err)
    }
}

export const allIssues = async (req, res, next) => {
    const { params, query } = req
    const trackerRef = new IssuesTracker({}, { name: params.project })

    try {
        await trackerRef.projectFindIssues(query)

        if (!trackerRef.docProject.issues.length) { // not sure if this should be an error
            throw new CustomError('no issues found', 200, { name: trackerRef.docProject.name})
        }

        res.status(200).json(trackerRef.docProject.issues)
    } catch(err) {
        next(err)
    }
}

export const deleteIssues = async (req, res, next) => {
    const { params, body: { issue_id } } = req
    const trackerRef = new IssuesTracker({ _id: issue_id }, { name: params.project })

    try {
        await trackerRef.issueDelete()
        res.status(200).json({
            result: 'successfully deleted',
            _id: trackerRef.docIssue._id
        })
    } catch(err) {
        next(err)
    }
}

export const updateIssues = async (req, res, next) => {
    const { params, body: { issue_id, ...rest } } = req
    const trackerRef = new IssuesTracker({ _id: issue_id, ...rest }, { name: params.project })

    try {
        await trackerRef.issueUpdate()
        res.status(200).json({
            result: 'successfully updated',
            _id: trackerRef.docIssue._id
        })
    } catch(err) {
        next(err)
    }
}

export const createIssues = async (req, res, next) => {
    const { params, body: { project_name, ...rest } } = req
    const trackerRef = new IssuesTracker(rest, { name: params.project })

    try {
        await trackerRef.projectSave()
        await trackerRef.issueSave()
        const { _doc: { __v, ...rest } } = trackerRef.docIssue

        res.status(201).json(rest)
    } catch(err) {
        next(err)
    }
}