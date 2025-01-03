import { Schema, model } from 'mongoose'


const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    book_id: {
        type: Schema.Types.ObjectId,
        ref: 'Books',
        required: true
    },
    created_on: {
        type: Date
    },
    created_by: {
        type: String
    }
})

export const Comment = model('Comments', commentSchema)