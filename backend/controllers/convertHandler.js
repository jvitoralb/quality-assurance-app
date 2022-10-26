class ConvertHandler {
    constructor() {
        this.inputValue = '',
        this.inputUnit = '',
        this.units = [
            ['kg', 'kilograms'],
            ['lbs', 'pounds'],
            ['L', 'liter'],
            ['gal', 'galon'],
            ['km', 'kilometers'],
            ['mi', 'miles']
        ]
    }

    getInput = (str) => {
        let convertPair = []

        this.units.forEach(pair => {
            let unit = pair[0]
            if (str.includes(unit)) {
                convertPair.push(...str.split(unit, 1), unit)
            }
        })
        this.inputUnit = convertPair[1]
        this.inputValue = convertPair[0]
    }

    getValue = (input) => {
        this.getInput(input) // Call this every time in getValue ?
        let result = this.inputValue || '1'

        if (result.split('/').length > 2) {
            // console.log('3/2/2 err')
            return null
        } else if (result.includes('/')) {
            let [ first, second ] = result.split('/')
            result = (Number(first) / Number(second))
        }

        return Number(result) // Does it need to be a typeof Number ?
    }

    getUnit = (input) => {
        this.getInput(input) // Call this every time in getUnit ?

        if (!this.inputUnit) {
            // console.log('invalid unit')
            return null
        }

        return this.inputUnit
    }

    getFullUnit = () => {
        if (!this.inputUnit) console.log('invalid unit')

        let [ unitPair ] = this.units.filter(pair => pair.includes(this.inputUnit))

        return unitPair[1]
    }

    convert = (input) => {
        // this.getInput(input) // Call this every time in getUnit ?
        let kgLbs = 2.205 // kg to lbs convert rate
        let galL = 3.78541 // gal to liter convert rate
        let miKm = 1.60934 // mile to km convert rate
        let result

        const convertRate = {
            'kg': [kgLbs, 'lbs'],
            'gal': [galL, 'L'],
            'mi': [miKm, 'km'],
            'lbs': [kgLbs, 'kg'],
            'L': [galL, 'gal'],
            'km': [miKm, 'mi']
        }

        if (['kg', 'gal', 'mi'].includes(this.inputUnit)) {
            result = String(this.inputValue * convertRate[this.inputUnit][0])
        }
        // Then add a request unit  before calling this
        if (['lbs', 'L', 'km'].includes(this.inputUnit)) {
            result = String(this.inputValue / convertRate[this.inputUnit][0])
        }

        if (result.length > 6) {
            result = result.slice(0, 6)
        }

        return result + convertRate[this.inputUnit][1]
    }
}

// let test = new ConvertHandler()

export default ConvertHandler