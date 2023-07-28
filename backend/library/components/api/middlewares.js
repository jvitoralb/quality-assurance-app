import CustomError from '../../errors/custom.js'
import { Book } from '../database/models/book.js'


export const checkOnBooks = async (req, res, next) => {
    const { _id } = req.params

    try {
        const report = await Book.exists({ _id })

        if (report === null) {
            throw new CustomError('no book exists', 400, { _id })
        }

        next()
    } catch(err) {
        if (err.kind == 'ObjectId') {
            err = new CustomError('no book exists', 400, { _id })
        }
        next(err)
    }
}

export const checkText = (req, res, next) => {
    if (!req.body.text || !req.body.text.trim()) {
        throw new CustomError('missing required field', 400, { field: 'text' })
    }

    next()
}

export const checkTitle = (req, res, next) => {
    if (!req.body.title) {
        throw new CustomError('missing required field', 400, { field: 'title' })
    }

    next()
}

export const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        let { message, status, info } = err
        return res.status(status).json({
            error: message,
            ...info
        })
    }

    return res.status(500).json({
        error: 'Something went wrong, try again later'
    })
}