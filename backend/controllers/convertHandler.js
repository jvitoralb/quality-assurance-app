export class ConvertHandler {
    constructor() {
        this.inputValue = '',
        this.inputUnit = null,
        this.returnValue = '',
        this.returnUnit = null,
        this.units = {
            kg: ['kilograms', 'lbs', 0.453592],
            lbs: ['pounds', 'kg', 0.453592],
            l: ['liters', 'gal', 3.78541],
            gal: ['gallons', 'l', 3.78541],
            km: ['kilometers', 'mi', 1.60934],
            mi: ['miles', 'km', 1.60934]
        }
    }

    validateInput = (input) => {
        let unitLower = input.replace(/[\d.\/]+/g, '').toLowerCase()
        this.inputValue = input.replace(/[a-z]+/gi, '') || '1'

        for(let y = 0; y < Object.keys(this.units).length; y++) {
            let key = Object.keys(this.units)[y]
            if (unitLower === key) {
                this.inputUnit = key
                this.returnUnit = this.units[key][1]
                return
            }
        }
        this.inputUnit = null
        this.returnUnit = null
    }

    getValue = () => {
        if (this.inputValue.split('/').length > 2) {
            this.inputValue = null
            throw new Error('invalid number')
        } else if (this.inputValue.includes('/')) {
            let [ first, second ] = this.inputValue.split('/')
            this.inputValue = (Number(first) / Number(second))
        }

        return Number(this.inputValue)
    }

    getUnit = () => {
        if (!this.inputUnit) {
            throw new Error('invalid unit')
        }

        return this.inputUnit === 'l' ? 'L' : this.inputUnit
    }

    getReturnUnit = () => {
        if (this.returnUnit == 'l') {
            return this.returnUnit.toUpperCase()
        }

        return this.returnUnit
    }

    getUnitName = (endUnit) => {
        if (endUnit) {
            return this.units[this.returnUnit][0]
        }

        return this.units[this.inputUnit][0]
    }

    convert = () => {
        if (['lbs', 'gal', 'mi'].includes(this.inputUnit)) {
            this.returnValue = this.inputValue * this.units[this.inputUnit][2]
        }

        if (['kg', 'l', 'km'].includes(this.inputUnit)) {
            this.returnValue = this.inputValue / this.units[this.inputUnit][2]
        }

        if (`${this.returnValue}`.length > 5) {
            this.returnValue = this.returnValue.toFixed(5)
        }

        return Number(this.returnValue)
    }

    getAllValues = () => ({
        initNum: this.getValue(),
        initUnit: this.getUnit(),
        unitName: this.getUnitName(),
        returnNum: this.convert(),
        returnUnit: this.getReturnUnit(),
        returnUnitName: this.getUnitName(true)
    })
}

export const handleInput = (req, res) => {
    const { input } = req.query
    let convertInput = new ConvertHandler()
    convertInput.validateInput(input)

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
        if (!convertInput.inputValue && !convertInput.inputUnit) {
            res.status(200).send('invalid number and unit')
            return
        }
        res.status(200).send(err.message)
    }
}