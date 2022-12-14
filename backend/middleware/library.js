import CustomError from '../errors/custom.js'
import { Book } from '../models/library.js'


export const checkOnBooks = async (req, res, next) => {
    try {
        const report = await Book.exists({ _id: req.params._id })

        if (report === null) {
            throw new CustomError('no book exists', 400, { _id: req.params._id })
        }
    } catch(err) {
        next(err)
    }

    next()
}

export const validBookTitle = (req, res, next) => { //personalLibrary.post('/api/books'
    const { title } = req.body

    if (!title) {
        throw new CustomError('missing required field title', 400)
    }

    next()
}