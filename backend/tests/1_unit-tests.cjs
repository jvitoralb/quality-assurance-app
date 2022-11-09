const chai = require('chai')


suite('Unit Tests', async () => {
    const { ConvertHandler, convertInput } = await import('../controllers/convertHandler.js')
    let testHandler = new ConvertHandler()
    let assert = chai.assert

    suite('Unit Tests - getNum', () => {
        test('#WholeNumber', (done) => {
            let result = convertInput('20kg')
            assert.strictEqual(result.initNum, 20)
            done()
        })
        test('#DecimalNumber', (done) => {
            let result = convertInput('3.1kg')
            assert.strictEqual(result.initNum, 3.1)
            done()
        })
        test('#Fraction', (done) => {
            let result = convertInput('1/2kg')
            assert.strictEqual(result.initNum, 0.5)
            done()
        })
        test('#Fraction With Decimal', (done) => {
            let result = convertInput('10.5/2kg')
            assert.isNumber(result.initNum)
            done()
        })
        test('#DoubleFraction Error', (done) => {
            let result = convertInput('1/2/2kg')
            assert.instanceOf(result, Error, 'invalid number')
            done()
        })
        test('#NoNumber defaults 1', (done) => {
            let result = convertInput('kg')
            assert.isNumber(result.initNum)
            done()
        })
    })

    const unitsKeys = Object.keys(testHandler.units)

    suite('Unit Tests - getUnit', () => {
        const input = [
            "gal", "l",
            "mi", "km",
            "lbs", "kg",
            "GAL", "L",
            "MI", "KM",
            "LBS", "KG"
        ]
    
        test('#Read Valid Unit', (done) => {
            input.forEach(unit => {
                let result = convertInput(unit)
                let unitRes = (['l', 'L'].includes(unit) ? unit.toUpperCase() : unit.toLowerCase())
                assert.strictEqual(result.initUnit, unitRes)
            })
            done()
        })

        test('#Invalid Unit Error', (done) => {
            let result = convertInput('10ty')
            assert.instanceOf(result, Error, 'invalid unit')
            done()
        })

        test('#Valid returnUnit', (done) => {
            unitsKeys.forEach(key => {
                let result = convertInput(key)
                let keyPair = testHandler.units[key]
                let returnUnit = (key === 'gal' ? keyPair[1].toUpperCase() : keyPair[1])
                assert.strictEqual(result.returnUnit, returnUnit)
            })
            done()
        })
    })

    suite('Unit Tests - getUnitName', () => {
        test('#Each Unit Name', (done) => {
            unitsKeys.forEach(key => {
                let result = convertInput(key)
                let keyPair = testHandler.units[key]
                assert.strictEqual(result.unitName, keyPair[0])
            })
            done()
        })
    })

    suite('Unit Tests - Convert', () => {
        test('#GalToLitter', (done) => {
            let result = convertInput('5gal')
            let expected = '18.92705L'
            assert.approximately(result.returnNum, 18.9271, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, expected)
            done()
        })

        test('#LitterToGal', (done) => {
            let result = convertInput('20L')
            let expected = '5.28344gal'
            assert.approximately(result.returnNum, 5.2834, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, expected)
            done()
        })

        test('#MileToKm', (done) => {
            let result = convertInput('5mi')
            let expected = '8.0467km'
            assert.approximately(result.returnNum, 8.0467, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, expected)
            done()
        })

        test('#KmToMile', (done) => {
            let result = convertInput('5km')
            let expected = '3.10686mi'
            assert.approximately(result.returnNum, 3.1068, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, expected)
            done()
        })

        test('#KgToPound', (done) => {
            let result = convertInput('5kg')
            let expected = '11.02312lbs'
            assert.approximately(result.returnNum, 11.0231, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, expected)
            done()
        })

        test('#PoundToKg', (done) => {
            let result = convertInput('10lbs')
            let expected = '4.53592kg'
            assert.approximately(result.returnNum, 4.5359, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, expected)
            done()
        })
    })
})