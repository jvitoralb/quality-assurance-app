import CustomError from '../errors/custom.js'


const checkValidBody = (req, res, next) => {
    let { project_name, issue_id, ...update } = req.body

    if (!issue_id) {
        throw new CustomError('missing _id', 400)
    }

    if (Object.values(update).every(val => !val)) {
        throw new CustomError('no update field(s) sent', 400, { _id: issue_id })
    }

    next()
} 

export default checkValidBody