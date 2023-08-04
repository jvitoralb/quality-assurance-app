import CustomError from '../../lib/error/custom.js'
import pathFrontend from '../../lib/pathConfig.js';
import ConvertHandler from '../service/services.js'


export const converterHome = (req, res, next) => {
    res.status(200).sendFile(`${pathFrontend}/public/converter.html`)
}

export const handleConversion = (req, res, next) => {
    const { value, unit } = req.body
    const convertInput = new ConvertHandler(value, unit)

    try {
        const {
            unitName,
            returnUnitName,
            ...result
        } = convertInput.getAllValues()

        res.status(200).json({
            ...result,
            string: `${result.initNum} ${unitName} converts to ${result.returnNum} ${returnUnitName}`
        })
    } catch(err) {
        if (!convertInput.inputUnit && !convertInput.inputValue) {
            throw new CustomError('invalid number and unit', 400)
        }
        next(err)
    }
}