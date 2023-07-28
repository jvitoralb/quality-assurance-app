import CustomError from '../errors/custom.js'
import ConvertHandler from '../service/services.js'


export const queryInput = (req, res, next) => {
    const { input } = req.query
    const { units } = new ConvertHandler()
    let inputUnit = input.replace(/[\d.\/]+/g, '').trim()
    let inputValue = input.replace(/[a-z]+/gi, '').trim()

    if (!inputUnit && !inputValue) {
        throw new CustomError('invalid number and unit', 400)
    }

    if (!Object.keys(units).includes(inputUnit.toLowerCase())) {
        inputUnit = ''
    }

    req.body = {
        value: inputValue,
        unit: inputUnit
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
