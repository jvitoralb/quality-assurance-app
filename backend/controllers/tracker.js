import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { Project, Issue } from '../models/tracker.js'
import CustomError from '../errors/custom.js'


class IssuesTracker {
    constructor(issueVals, project) {
        this.issueVals = issueVals
        this.project = project
    }

    issueDelete = async () => {
        try {
            this.issueVals = await Issue.findByIdAndDelete(this.issueVals._id)
            this.projectFind() // this doesnt have a await key because there isn't anything to push
            this.projectUpdate(true)
            return this.issueVals
        } catch(err) {
            throw err
        }
    }

    projectFind = async (filters) => {
        try {
            this.project = await Project.findOne({ name: this.project.name })
            .select('-__v').populate({
                path: 'issues',
                select: '-__v -project',
                match: filters || null
            })

            return this.project
        } catch(err) {
            throw err
        }
    }

    issueFind = async () => {
        try {
            return await Issue.findById(this.issueVals._id)
            .select('-__v')
        } catch(err) {
            throw err
        }
    }

    projectUpdate = async (remove) => {
        console.log('trying to update')
        try {
            await Project.findOneAndUpdate({ _id: this.project._id }, {
                [remove ? '$pull' : '$push']: {
                    issues: ObjectId(this.issueVals._id)
                }
            }, { new: true })
        } catch(err) {
            throw err
        }
    }

    issueUpdate = async () => {
        const { project_name, ...update } = this.issueVals

        try {
            this.issueVals = await Issue.findByIdAndUpdate(this.issueVals._id, {
                $set: {
                    ...update,
                    updated_on: new Date()
                }
            }, { new: true }).select('-__v')

            return this.issueVals
        } catch(err) {
            if (err.name === 'CastError') {
                throw new CustomError(`could not update`, 400, { _id: this.issueVals._id })
            }
            throw err
        }
    }

    issueSave = async () => {
        const newIssue = new Issue({
            _id: new mongoose.Types.ObjectId,
            project: this.project._id,
            created_on: new Date(),
            updated_on: new Date(),
            ...this.issueVals
        })

        try {
            this.issueVals = await newIssue.save()
            await this.projectUpdate()
        } catch(err) {
            if (err.name === 'ValidationError') {
                throw new CustomError('required field(s) missing', 400)
            }
            throw err
        }
    }

    projectSave = async () => {
        const newProject = new Project({
            name: this.project.name
        })

        try {
            this.project = await newProject.save()
        } catch(err) {
            if (err.code === 11000) {
                await this.projectFind()
                return
            }
            throw err
        }
    }
}

export const deleteIssues = async (req, res, next) => {
    const { params, body: { issue_id, _id, ...rest } } = req
    const trackerRef = new IssuesTracker({ _id: issue_id || _id }, { name: params.project })

    try {
        const deleted = await trackerRef.issueDelete()

        if (!deleted) {
            throw new CustomError('could not delete', 400, { _id: issue_id || _id })
        }

        res.status(200).json({
            result: 'successfully deleted',
            _id: deleted._id
        })
    } catch(err) {
        next(err)
    }
}

export const updateIssues = async (req, res, next) => {
    const { params, body: { issue_id, _id, ...rest } } = req
    const trackerRef = new IssuesTracker({ _id: issue_id || _id, rest }, { name: params.project })
        // if the update field comes undefined it updates 
        // it should not
    try {
        const updated = await trackerRef.issueUpdate()
        // reset all info stored in trackerRef
        // First see if it is a problem
        if (!updated) {
            throw new CustomError(`could not update`, 400, { _id: issue_id || _id })
        }

        return res.status(200).json({
            result: 'successfully updated',
            _id: updated._id
        })
    } catch(err) {
        next(err)
    }
}

export const getAllProjects = async (req, res, next) => {
    const { body, params } = req
    const trackerRef = new IssuesTracker(body, { name: params.project })

    try {
        const docs = await Project.find({})
        .select('-__v')

        res.status(200).json(docs)
    } catch(err) {
        next(err)
    }
}

export const getAllIssues = async (req, res, next) => {
    const { body, params, query } = req
    const trackerRef = new IssuesTracker(body, { name: params.project })

    try {
        const { issues } = await trackerRef.projectFind(query)

        res.status(200).json(issues)
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
        const doc = await trackerRef.issueFind()
        // reset all info stored in trackerRef
        // First see if it is a problem
        res.status(201).json(doc)
    } catch(err) {
        next(err)
    }
}