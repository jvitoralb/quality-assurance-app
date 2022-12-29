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

class Comments  {
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

const handleGet = async (refBook, next) => {
    let answer
    try {
        answer = await refBook.findBooks()
    } catch(err) {
        next(err)
    }
    return { answer }
}

const handlePost = async (refBook, refComment, next) => {
    let result = { statusCode: 201 }

    try {
        if (refBook._id) {
            await refComment.createComments()
            await refComment.commentsOnBooks('$push')
            result.answer = await refBook.findBooks()
        } else {
            await refBook.createBooks()
            result.answer = refBook
        }
    } catch(err) {
        next(err)
    }

    return result
}

const handleDelete = async (refBook, refComment, next) => {
    let message = {}

    try {
        if (refComment._id) {
            message = await refComment.deleteComments(true)
            await refComment.commentsOnBooks('$pull')
        } else {
            message = await refBook.deleteBooks()
            message.comments = await refComment.deleteComments()
        }
    } catch(err) {
        next(err)
    }

    return { answer: message }
}

const libraryHandler = async (req, res, next) => {
    const refBook = new Books(req.params._id, req.body.title)
    const refComment = new Comments(req.body.text, req.params._id, req.query.comment)

    const sendResponse = (answer, statusCode = 200) => {
        res.status(statusCode).json(answer)
    }

    const controllers = {
        'GET': () => handleGet(refBook, next),
        'POST': () => handlePost(refBook, refComment, next),
        'DELETE': () => handleDelete(refBook, refComment, next)
    }

    if (controllers[req.method]) {
        let { answer, statusCode } = await controllers[req.method]()
        sendResponse(answer, statusCode)
    } else {
        next()
    }
}

export default libraryHandler