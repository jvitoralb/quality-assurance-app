const chai = require('chai')


suite('Unit Tests', async () => {
    const ConvertHandler = (await import('../components/service/services.js')).default
    let assert = chai.assert

    suite('Unit Tests - getNum', () => {
        test('#WholeNumber', (done) => {
            let testHandler = new ConvertHandler('20', 'kg')
            assert.strictEqual(testHandler.getValue(), 20)
            done()
        })
        test('#DecimalNumber', (done) => {
            let testHandler = new ConvertHandler('3.1', 'kg')
            assert.strictEqual(testHandler.getValue(), 3.1)
            done()
        })
        test('#Fraction', (done) => {
            let testHandler = new ConvertHandler('1/2', 'kg')
            assert.strictEqual(testHandler.getValue(), 0.5)
            done()
        })
        test('#Fraction With Decimal', (done) => {
            let testHandler = new ConvertHandler('10.5/2', 'kg')
            assert.isNumber(testHandler.getValue())
            done()
        })
        test('#DoubleFraction Error', (done) => {
            let testHandler = new ConvertHandler('1/2/2', 'kg')
            assert.Throw(() => testHandler.getValue(), 'invalid number')
            done()
        })
        test('#NoNumber defaults 1', (done) => {
            let testHandler = new ConvertHandler('', 'kg')
            assert.isNumber(testHandler.getValue())
            done()
        })
    })

    const unitsKeys = Object.keys(new ConvertHandler().units)

    suite('Unit Tests - getUnit', () => {
        test('#Read Valid Unit', (done) => {
            unitsKeys.forEach(unit => {
                let unitRes = (unit == 'l' ? unit.toUpperCase() : unit.toLowerCase())

                let testHandler = new ConvertHandler('', unit)
                assert.strictEqual(testHandler.getUnit(), unitRes)

                testHandler.inputUnit = unit.toUpperCase()
                assert.strictEqual(testHandler.getUnit(), unitRes)
            })
            done()
        })
        test('#Invalid Unit Error', (done) => {
            let testHandler = new ConvertHandler('10', 'ty')
            assert.throws(() => testHandler.getUnit(), 'invalid unit')
            done()
        })
        test('#Valid returnUnit', (done) => {
            unitsKeys.forEach(key => {
                let testHandler = new ConvertHandler('', key)
                let returnUnit = testHandler.getAllValues().returnUnit
                let expected = testHandler.units[key][1] == 'l' ?
                               testHandler.units[key][1].toUpperCase() :
                               testHandler.units[key][1]
                assert.strictEqual(returnUnit, expected)
            })
            done()
        })
    })

    suite('Unit Tests - getUnitName', () => {
        test('#Each Unit Name', (done) => {
            unitsKeys.forEach(key => {
                let testHandler = new ConvertHandler('', key)
                let keyPair = testHandler.units[key]
                assert.strictEqual(testHandler.getUnitName(), keyPair[0])
            })
            done()
        })
    })

    suite('Unit Tests - Convert', () => {
        test('#GalToLitter', (done) => {
            let testHandler = new ConvertHandler('5', 'gal')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 18.9271, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '18.92705L')
            done()
        })
        test('#LitterToGal', (done) => {
            let testHandler = new ConvertHandler('20', 'L')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 5.2834, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '5.28344gal')
            done()
        })
        test('#MileToKm', (done) => {
            let testHandler = new ConvertHandler('5', 'mi')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 8.0467, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '8.0467km')
            done()
        })
        test('#KmToMile', (done) => {
            let testHandler = new ConvertHandler('5', 'km')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 3.1068, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '3.10686mi')
            done()
        })
        test('#KgToPound', (done) => {
            let testHandler = new ConvertHandler('5', 'kg')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 11.0231, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '11.02312lbs')
            done()
        })
        test('#PoundToKg', (done) => {
            let testHandler = new ConvertHandler('10', 'lbs')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 4.5359, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '4.53592kg')
            done()
        })
    })
})
