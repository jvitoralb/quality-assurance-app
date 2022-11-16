import CustomError from '../errors/custom.js'


const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        return res.status(err.status).json({
            message: err.message
        })
    }

    return res.status(500).json({
        message: 'Something went wrong, try again later'
    })
}

export default errorHandler