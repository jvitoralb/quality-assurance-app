import { Schema, model } from 'mongoose'


const issueSchema = new Schema({
    _id: Schema.Types.ObjectId,
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
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
    created_on: {
        type: Date
    },
    updated_on: {
        type: Date
    },
    created_by: {
        type: String,
        required: true
    },
    assigned_to: {
        type: String,
        default: ''
    },
    open: {
        type: Boolean,
        default: true
    },
    status_text: {
        type: String,
        default: ''
    }
})

export const Issue = model('Issue', issueSchema)