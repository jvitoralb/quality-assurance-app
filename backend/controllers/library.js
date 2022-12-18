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
            resultMessage = { message: 'delete successful', _id: this._id }
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

        return { ...resultMessage, deletedCount}
    }

    createComments = async () => {
        const saveComment = new Comment({
            ...this,
            created_on: new Date()
        })
        try {
            const { _id } = await saveComment.save()
            this._id = _id
        } catch(err) {
            console.log(err)
        }
    }
}

/**
 * multiple responses inside same controller
**/

export const libraryHandleGet = async (req, res, next) => {
    const refBook = new Books(req.params._id)

    try {
        let result
        if (req.params._id) {
            const [ book ] = await refBook.findBooks()
            result = book
        } else {
            result = await refBook.findBooks()
        }
        res.status(200).send(result)
    } catch(err) {
        next(err)
    }
}

export const libraryHandlePost = async (req, res, next) => {
    const refBook = new Books(req.params._id, req.body.title)
    const refComment = new Comments(req.body.text, req.params._id)

    try {
        if (req.params._id) {
            await refComment.createComments()
            await refComment.commentsOnBooks('$push')
            let [ book ] = await refBook.findBooks()
            res.status(201).json(book)
            return
        }

        await refBook.createBooks()
        res.status(201).json(refBook)
    } catch(err) {
        next(err)
    }
}

export const libraryHandleDelete = async (req, res, next) => {
    const refBook = new Books(req.params._id)
    const refComment = new Comments(null, req.params._id, req.query.comment)

    try {
        if (req.query.comment) {
            const delComment = await refComment.deleteComments(true)
            await refComment.commentsOnBooks('$pull')
            res.status(200).json(delComment)
            return
        }

        const delMessage = await refBook.deleteBooks()
        await refComment.deleteComments()
        res.status(200).send(delMessage.message)
        // res.status(200).json(delMessage)
    } catch(err) {
        next(err)
    }
}