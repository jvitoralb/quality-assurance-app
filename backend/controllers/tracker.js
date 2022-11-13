import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { Project, Issue } from '../models/tracker.js'


class IssuesTracker {
    constructor(issueBody, project) {
        this.issueBody = issueBody
        this.project = project
    }

    findProject = async () => {
        try {
            return await Project.findOne({ name: this.project }).select('-__v')
        } catch(err) {
            console.log(err, '<--- findProject error ---')
        }
    }

    updateProjectIssues = async (issueDoc) => {
        try {
            await Project.findByIdAndUpdate(issueDoc.project, {
                $push: {
                    issues: ObjectId(issueDoc._id)
                }
            })
            return 'done'
        } catch(err) {
            console.log(err, '<--- updateProjectIssues error ---')
        }
    }

    saveIssue = async () => {
        const { project_name, ...issueProps } = this.issueBody

        try {
            const { _id } = await this.findProject()

            const newIssue = new Issue({
                _id: new mongoose.Types.ObjectId, // test if i really need this
                project: _id,
                ...issueProps
            })

            const savedIssue = await newIssue.save()

            return savedIssue
        } catch(err) {
            console.log(err, '<--- saveIssue error ---')
        }
    }

    saveProject = async () => {
        // need to check if project already exists in db
        const newProject = new Project({
            name: this.project
        })

        try {
            const savedProject = await newProject.save()
            return savedProject
        } catch(err) {
            console.log(err, '<--- Save doc error ---')
        }
    }
}

export const trackerHandler = async (req, res) => {
    const projectName = req.params.project || req.body.project_name
    const issue = new IssuesTracker(req.body, projectName)

    try {
        const projectSaved = await issue.saveProject()
        const issueSaved = await issue.saveIssue()
        await issue.updateProjectIssues(issueSaved)

        res.status(201).json({
            // projectSaved,
            issueSaved
        })
    } catch(err) {
        console.log(err, '<--- issueTrackerHandler error ---')
    }
}