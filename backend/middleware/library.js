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
        res.status(200).send(err.message)
        // next(err)
    }
}

export const checkText = (req, res, next) => {
    if (req.body.comment) {
        req.body.text = req.body.comment.trim()
    }
    if (!req.body.text && (!req.body.comment || !req.body.text.trim())) {
        res.status(200).send('missing required field comment')
        // throw new CustomError('missing required field comment', 200) // FCC
    } else {
        next()
    }
}

export const checkTitle = (req, res, next) => {
    if (!req.body.title) {
        res.status(200).send('missing required field title')
        // throw new CustomError('missing required field title', 200) // FCC
    } else {
        next()
    }
}