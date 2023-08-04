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

export const Book = model('Books', bookSchema)