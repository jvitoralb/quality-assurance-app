import { Schema, model } from 'mongoose'


const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    issues: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Issues'
        }
    ]
})

const issueSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Projects',
        required: true
    },
    issue_title: {
        type: String,
        required: true
    },
    issue_text: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    assinged_to: {
        type: String
    },
    status_text: {
        type: String
    }
})

export const Project = model('Project', projectSchema)
export const Issue = model('Issue', issueSchema)