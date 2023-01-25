import { ObjectId } from 'mongodb'
import { Book, Comment } from '../models/library.js'


export class Books {
    constructor(bookId, title) {
        this._id = bookId
        this.title = title
        this.comments
        this.commentcount
    }

    deleteBooks = async () => {
        const deleteThis = {}
        let resultMessage = { message: 'complete delete successful' }

        if (this._id) {
            deleteThis._id = this._id
            resultMessage = { message: 'book delete successful', _id: this._id }
        }

        const { deletedCount } = await Book.deleteMany(deleteThis)

        return { ...resultMessage, deletedCount }
    }

    findBooks = async () => {
        let options = {}
        let getMatch = {}
        let getSelect = { __v: 0, comments: 0 }

        if (this._id) {
            getMatch._id = this._id
            delete getSelect.comments
            options.populate = { path: 'comments', select: '-__v -book_id' }
        }

        return await Book.find(getMatch, getSelect, options)
    }

    createBooks = async () => {
        const saveTitle = new Book(this)

        const { _id, title } = await saveTitle.save()
        this._id = _id
        this.title = title
    }
}

export class Comments  {
    constructor(text, bookId, textId) {
        this._id = textId
        this.book_id = bookId
        this.text = text
        this.created_by = 'Ursinho Pooh!'
    }

    countComments = async () => {
        return await Comment.countDocuments({ book_id: this.book_id })
    }

    commentsOnBooks = async (option) => {
        const count = await this.countComments()
        await Book.findOneAndUpdate({ _id: this.book_id }, {
            [option]: {
                comments: ObjectId(this._id)
            },
            $set: {
                commentcount: count
            }
        })
    }

    deleteComments = async (singleComment) => {
        const delMatch = {}
        let resultMessage = { message: 'all comments deleted' }

        if (this.book_id) {
            delMatch.book_id = this.book_id
            resultMessage.book_id = this.book_id
        }

        if (singleComment) {
            delMatch._id = this._id
            resultMessage = { message: 'comment deleted', _id: this._id }
        }

        const { deletedCount } = await Comment.deleteMany(delMatch)

        return { ...resultMessage, deletedCount }
    }

    createComments = async () => {
        const saveComment = new Comment({
            ...this,
            created_on: new Date()
        })
        const { _id } = await saveComment.save()
        this._id = _id
    }
}

export const handleGet = async (bookStats) => {
    const refBook = new Books(bookStats._id, bookStats.title)
    return await refBook.findBooks()
}

export const handlePost = async (bookStats, commentStats) => {
    const refBook = new Books(bookStats._id, bookStats.title)
    const refComment = new Comments(commentStats.text, commentStats._id, commentStats.comment)
    let result

    if (refBook._id) {
        await refComment.createComments()
        await refComment.commentsOnBooks('$push')
        result = await refBook.findBooks()
    } else {
        await refBook.createBooks()
        result = refBook
    }

    return result
}

export const handleDelete = async (bookStats, commentStats) => {
    const refBook = new Books(bookStats._id, bookStats.title)
    const refComment = new Comments(commentStats.text, commentStats._id, commentStats.comment)
    let message = {}

    if (refComment._id) {
        message = await refComment.deleteComments(true)
        await refComment.commentsOnBooks('$pull')
    } else {
        message = await refBook.deleteBooks()
        message.comments = await refComment.deleteComments()
    }

    return message
}