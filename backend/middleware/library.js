import CustomError from '../errors/custom.js'
import { Book } from '../models/library.js'


export const checkOnBooks = async (req, res, next) => {
    const { _id } = req.params

    try {
        const report = await Book.exists({ _id })

        if (report === null) {
            throw new CustomError('no book exists', 200, { _id }) // FCC
        }

        next()
    } catch(err) {
        if (err.kind == 'ObjectId') {
            err = new CustomError('no book exists', 200, { _id }) // FCC
        }
        next(err)
    }
}

export const checkText = (req, res, next) => {
    if (!req.body.text.trim()) {
        throw new CustomError('missing required field comment', 200) // FCC
    }

    next()
}

export const checkTitle = (req, res, next) => {
    if (!req.body.title) {
        throw new CustomError('missing required field title', 200) // FCC
    }

    next()
}