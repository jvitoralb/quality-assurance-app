export class ConvertHandler {
    constructor() {
        this.inputValue = '',
        this.inputUnit = '',
        this.units = {
            kg: ['kilograms', 'lbs', 0.453592],
            lbs: ['pounds', 'kg', 0.453592],
            l: ['liters', 'gal', 3.78541],
            gal: ['gallons', 'l', 3.78541],
            km: ['kilometers', 'mi', 1.60934],
            mi: ['miles', 'km', 1.60934]
        }
    }

    getInput = (input) => {
        let unitLower = input.replace(/[\d.\/]+/g, '').toLowerCase()

        this.inputValue = input.replace(/[a-z]+/gi, '') || '1'

        Object.keys(this.units).forEach(key => {
            if (unitLower === key) {
                this.inputUnit = key
            }
        })
    }

    getValue = () => {
        let result = this.inputValue

        if (result.split('/').length > 2) {
            this.inputValue = null
            throw new Error('invalid number')
        } else if (result.includes('/')) {
            let [ first, second ] = result.split('/')
            result = (Number(first) / Number(second))
            this.inputValue = result
        }

        return Number(result)
    }

    getUnit = () => {
        if (!this.inputUnit) {
            this.inputUnit = null
            throw new Error('invalid unit')
        }

        return this.inputUnit === 'l' ? 'L' : this.inputUnit
    }

    getUnitName = () => {
        let [ unitName ] = this.units[this.inputUnit]

        return unitName
    }

    getAllValues = () => ({
        num: this.getValue(),
        unit: this.getUnit(),
        unitName: this.getUnitName()
    })

    convert = () => {
        // 0.453592,lbs to kg convert rate
        // 3.78541,gal to liter convert rate
        // 1.60934,mile to km convert rate
        let result

        if (['lbs', 'gal', 'mi'].includes(this.inputUnit)) {
            result = this.inputValue * this.units[this.inputUnit][2]
        }
        // Then add a request unit before calling this
        if (['kg', 'l', 'km'].includes(this.inputUnit)) {
            result = this.inputValue / this.units[this.inputUnit][2]
        }

        if (`${result}`.length > 5) {
            result = result.toFixed(5)
        }

        let [ unitName, returnUnit ] = this.units[this.inputUnit]

        return result + returnUnit
    }
}

export const convertInput = (input) => {
    let handle = new ConvertHandler()

    try {
        handle.getInput(input)
        const initVals = handle.getAllValues()
        handle.getInput(handle.convert())
        const returnVals = handle.getAllValues()

        return {
            initNum: initVals.num,
            initUnit: initVals.unit,
            unitName: initVals.unitName,
            returnNum: returnVals.num,
            returnUnit: returnVals.unit,
            string: `${initVals.num} ${initVals.unitName} converts to ${returnVals.num} ${returnVals.unitName}`
        }
    } catch(err) {
        if (!handle.inputValue && !handle.inputUnit) {
            return new Error('invalid number and unit')
        }
        return err
    }
}

export const handleInput = (req, res) => {
    const { input } = req.query
    const result = convertInput(input)

    if (result instanceof Error) {
        return res.status(200).send(result.message)
    }

    let { unitName, ...rest } = result

    res.status(200).json({
        ...rest
    })
}