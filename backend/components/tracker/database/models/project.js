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
            ref: 'Issue'
        }
    ]
})

export const Project = model('Project', projectSchema)