class ConvertHandler {
    constructor() {
        this.inputValue = '',
        this.inputUnit = '',
        this.units = [
            ['kg', 'kilograms'],
            ['lbs', 'pounds'],
            ['l', 'liter'],
            ['gal', 'galon'],
            ['km', 'kilometers'],
            ['mi', 'miles']
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

        return this.inputUnit
    }

    getFullUnit = () => {
        let [ unitPair ] = this.units.filter(pair => pair.includes(this.inputUnit))

        return unitPair[1]
    }

    convert = () => {
        let kgLbs = 2.205 // kg to lbs convert rate
        let galL = 3.78541 // gal to liter convert rate
        let miKm = 1.60934 // mile to km convert rate
        let result

        const convertRate = {
            'kg': [kgLbs, 'lbs'],
            'gal': [galL, 'l'],
            'mi': [miKm, 'km'],
            'lbs': [kgLbs, 'kg'],
            'l': [galL, 'gal'],
            'km': [miKm, 'mi']
        }

        if (['kg', 'gal', 'mi'].includes(this.inputUnit)) {
            result = String(this.inputValue * convertRate[this.inputUnit][0])
        }
        // Then add a request unit  before calling this
        if (['lbs', 'l', 'km'].includes(this.inputUnit)) {
            result = String(this.inputValue / convertRate[this.inputUnit][0])
        }

        // if (result.length > 6) {
        //     result = result.slice(0, 6)
        // }

        return result + convertRate[this.inputUnit][1]
    }
}

export const convertInput = (req, res) => {
    const { input } = req.query
    let handle = new ConvertHandler()

    try {
        handle.getInput(input)
        let initNum = handle.getValue()
        let initUnit = handle.getUnit()

        handle.getInput(handle.convert())

        let returnNum = handle.getValue()
        let returnUnit = handle.getUnit()
        console.log({
            initNum,
            initUnit,
            returnUnit,
            returnNum,
            string: ''
        }, 'res')
        res.status(200).json({
            initNum,
            initUnit,
            returnUnit,
            returnNum,
            string: ''
        })
    } catch(err) {
        if (!handle.inputValue && !handle.inputUnit) {
            return res.send('invalid number and unit')
        }
        res.send(err.message)
    }
}

export default ConvertHandler