import { Schema, model } from 'mongoose'


const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        default: 'Unknown',
        trim: true
    },
    commentcount: {
        type: Number,
        default: 0
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }]
})

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
export const Book = model('Books', bookSchema)