import CustomError from '../errors/custom.js'


export const validateDeletion = (req, res, next) => {
    // I don't really like this
    let { issue_id, _id } = req.body

    if (!issue_id && !_id) {
        throw new CustomError('missing _id', 400)
    }

    next()
}

const checkValidBody = (req, res, next) => {
    let { project_name, issue_id, _id, ...update } = req.body

    if (!issue_id && !_id) {
        throw new CustomError('missing _id', 400)
    }

    if (Object.values(update).every(val => !val)) {
        throw new CustomError('no update field(s) sent', 400, { _id: issue_id || _id })
    }

    next()
} 

export default checkValidBody