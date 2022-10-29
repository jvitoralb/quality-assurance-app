export class ConvertHandler {
    constructor() {
        this.inputValue = '',
        this.inputUnit = '',
        this.units = [
            ['kg', 'kilograms', 'lbs'],
            ['lbs', 'pounds', 'kg'],
            ['l', 'liter', 'gal'],
            ['gal', 'galon', 'l'],
            ['km', 'kilometers', 'mi'],
            ['mi', 'miles', 'km']
        ]
    }

    getInput = (input) => {
        let unitLower = input.replace(/[\d.\/]+/g, '').toLowerCase()

        this.inputValue = input.replace(/[a-z]+/gi, '') || '1'

        this.units.forEach(pair => {
            let unit = pair[0]
            if (unitLower === unit) {
                this.inputUnit = unit
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
        let [ unitPair ] = this.units.filter(pair => pair[0] === this.inputUnit)

        return unitPair[1]
    }

    convert = () => {
        let kgLbs = 2.20462 // kg to lbs convert rate
        let galL = 3.78541 // gal to liter convert rate
        let miKm = 1.60934 // mile to km convert rate
        let result

        const convertRate = {
            'kg': kgLbs,
            'gal': galL,
            'mi': miKm,
            'lbs': kgLbs,
            'l': galL,
            'km': miKm
        }

        if (['kg', 'gal', 'mi'].includes(this.inputUnit)) {
            result = String(this.inputValue * convertRate[this.inputUnit])
        }
        // Then add a request unit before calling this
        if (['lbs', 'l', 'km'].includes(this.inputUnit)) {
            result = String(this.inputValue / convertRate[this.inputUnit])
        }

        if (result.length > 8) {
            result = result.slice(0, 8)
        }

        let [ returnUnit ] = this.units.filter(pair => pair[0] === this.inputUnit)

        return result + returnUnit[2]
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
        return{
            ...init,
           returnNum: handle.getValue(),
           returnUnit: handle.getUnit()
        }
    } catch(err) {
        if (!handle.inputValue && !handle.inputUnit) {
            return res.send('invalid number and unit')
        }
        res.send(err.message)
    }
}

// export default ConvertHandler