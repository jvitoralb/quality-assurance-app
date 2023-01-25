import CustomError from '../errors/custom.js'


export default class ConvertHandler {
    constructor(value, unit) {
        this.inputValue = value || '1',
        this.inputUnit = unit,
        this.returnValue = '',
        this.returnUnit = '',
        this.units = {
            kg: ['kilograms', 'lbs', 0.453592],
            lbs: ['pounds', 'kg', 0.453592],
            l: ['liters', 'gal', 3.78541],
            gal: ['gallons', 'l', 3.78541],
            km: ['kilometers', 'mi', 1.60934],
            mi: ['miles', 'km', 1.60934]
        }
    }

    getValue = () => {
        if (this.inputValue.split('/').length > 2) {
            this.inputValue = null
            throw new CustomError('invalid number', 400)
        } else if (this.inputValue.includes('/')) {
            let [ first, second ] = this.inputValue.split('/')
            this.inputValue = (Number(first) / Number(second))
        }

        return Number(this.inputValue)
    }

    getUnit = () => {
        this.inputUnit = this.inputUnit.toLowerCase()

        if (!Object.keys(this.units).includes(this.inputUnit)) {
            throw new CustomError('invalid unit', 400)
        }

        return this.inputUnit === 'l' ? 'L' : this.inputUnit
    }

    getReturnUnit = () => {
        for(let y = 0; y < Object.keys(this.units).length; y++) {
            let key = Object.keys(this.units)[y]
            if (this.inputUnit === key) {
                this.returnUnit = this.units[key][1]
                break
            }
        }

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
            this.returnValue = Number(this.returnValue).toFixed(5)
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