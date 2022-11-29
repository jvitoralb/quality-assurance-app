import { ConvertHandler } from '../controllers/convertHandler.js'
import CustomError from '../errors/custom.js'


const queryInput = (req, res, next) => {
    const { input } = req.query
    let inputUnit = input.replace(/[\d.\/]+/g, '')
    let inputValue = input.replace(/[a-z]+/gi, '')

    if (!inputUnit && !inputValue) {
        throw new CustomError('invalid number and unit', 400)
    }

    req.body = {
        value: inputValue,
        unit: inputUnit
    }

    next()
}

export default queryInput