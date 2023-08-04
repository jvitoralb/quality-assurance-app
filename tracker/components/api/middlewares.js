import CustomError from '../../lib/error/custom.js'


export const validateQueries = (req, res, next) => {
    if (req.query.issue_id) {
        req.query._id = req.query.issue_id
        delete req.query.issue_id
    }

    next()
}

export const validateBody = (req, res, next) => {
    let { project_name, issue_id, ...update } = req.body

    if (!issue_id) {
        throw new CustomError('missing _id', 400)
    }

    if (req.method === 'PUT' && Object.values(update).every(val => !val)) {
        throw new CustomError('no update field(s) sent', 400, { _id: issue_id })
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