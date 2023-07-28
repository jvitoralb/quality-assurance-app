import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import CustomError from '../../errors/custom.js'
import { Project } from '../database/models/project.js'
import { Issue } from '../database/models/issue.js'


export default class IssuesTracker {
    constructor(docIssue, docProject) {
        this.docIssue = docIssue
        this.docProject = docProject
    }

    projectDelete = async () => {
        let tempProject = this.docProject
        this.docProject = await Project.findOneAndDelete({ name: tempProject.name })

        if (!this.docProject) {
            throw new CustomError('could not delete', 400, { name: tempProject.name })
        }

        await Issue.deleteMany({ project: this.docProject._id })
    }

    issueDelete = async () => {
        let answer = await Issue.deleteMany({ _id: this.docIssue._id })

        if (!answer.deletedCount) {
            throw new CustomError('could not delete', 400, { _id: this.docIssue._id })
        }

        await this.projectUpdate(true)
    }

    projectFindIssues = async (filters) => {
        let tempProject = this.docProject
        this.docProject = await Project.findOne({ name: tempProject.name }, '-__v')
        .populate({
            path: 'issues',
            select: '-__v -project',
            match: filters || null
        })

        if (!this.docProject) {
            throw new CustomError('could not find project', 400, { name: tempProject.name })
        }
    }

    projectFindAll = async () => {
        this.docProject = await Project.find({}, '-__v')

        if (!this.docProject.length) {
            throw new CustomError('no projects found', 200)
        }
    }

    projectUpdate = async (remove) => {
        this.docProject = await Project.findOneAndUpdate({ name: this.docProject.name }, {
            [remove ? '$pull' : '$push']: {
                issues: ObjectId(this.docIssue._id)
            }
        }, { new: true })

        if (!this.docProject) {
            throw new CustomError('could not update project', 400, { name: this.docProject.name })
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
                throw { name: 'CustomError' }
            }
        } catch(err) {
            if (err.name === 'CastError' || err.name === 'CustomError') {
                throw new CustomError('could not update', 400, { _id })
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
            const { _doc: { __v, ...rest } } = await newIssue.save()
            this.docIssue = rest
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
        const oldProject = await Project.exists(this.docProject)

        if (oldProject) {
            await this.projectFindIssues()
        } else {
            this.docProject = await newProject.save()
        }
    }
}