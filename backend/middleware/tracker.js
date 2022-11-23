import CustomError from '../errors/custom.js'


export const validateQueries = (req, res, next) => {
    if (req.query.issue_id) {
        req.query._id = req.query.issue_id
        delete req.query.issue_id
    }

    next()
}

export const validateBody = (req, res, next) => {
    let { project_name, issue_id, _id, ...update } = req.body

    if (!issue_id && !_id) {
        // throw new CustomError('missing _id', 200)
        throw new CustomError('missing _id', 400)
    }

    if (req.method === 'PUT' && Object.values(update).every(val => !val)) {
        // throw new CustomError('no update field(s) sent', 200, { _id: issue_id || _id })
        throw new CustomError('no update field(s) sent', 400, { _id: issue_id || _id })
    }

    next()
}