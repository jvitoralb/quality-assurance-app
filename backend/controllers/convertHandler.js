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

export const convertInput = (req, res) => {
    const { input } = req.query
    let handle = new ConvertHandler()

    try {
        handle.getInput(input)
        let initNum = handle.getValue()
        let initUnit = handle.getUnit()
        let unitName = handle.getUnitName()

        handle.getInput(handle.convert())

        let returnNum = handle.getValue()
        let returnUnit = handle.getUnit()
        let returnUnitName = handle.getUnitName()

        res.status(200).json({
            initNum,
            initUnit,
            returnNum,
            returnUnit,
            string: `${initNum} ${unitName} converts to ${returnNum} ${returnUnitName}`
        })
    } catch(err) {
        if (!handle.inputValue && !handle.inputUnit) {
            return res.send('invalid number and unit')
        }
        res.send(err.message)
    }
}

export const convertInputTests = (input) => {
    let handle = new ConvertHandler()

    try {
        handle.getInput(input)
        const init = {
            initNum: handle.getValue(),
            initUnit: handle.getUnit(),
            unitName: handle.getUnitName()
        }
        handle.getInput(handle.convert())

        let returnNum = handle.getValue()
        let returnUnit = handle.getUnit()
        let returnUnitName = handle.getUnitName()
        return {
            ...init,
            returnNum,
            returnUnit,
            string: `${init.initNum} ${init.unitName} converts to ${returnNum} ${returnUnitName}`
        }
    } catch(err) {
        if (!handle.inputValue && !handle.inputUnit) {
            return err
        }
        return err
    }
}