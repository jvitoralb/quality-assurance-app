const chai = require('chai')

console.log('unit-tests')
suite('Unit Tests', async () => {
    const { ConvertHandler, convertInputTests } = await import('../controllers/convertHandler.js')
    let testHandler = new ConvertHandler()
    let assert = chai.assert

    test('#WholeNumber', (done) => {
        testHandler.getInput('20kg')
        assert.strictEqual(testHandler.getValue(), 20)
        done()
    })
    test('#DecimalNumber', (done) => {
        testHandler.getInput('3.1kg')
        assert.strictEqual(testHandler.getValue(), 3.1)
        done()
    })
    test('#Fraction', (done) => {
        testHandler.getInput('1/2kg')
        assert.strictEqual(testHandler.getValue(), 0.5)
        done()
    })
    test('#Fraction With Decimal', (done) => {
        testHandler.getInput('10.5/2kg')
        assert.isNumber(testHandler.getValue())
        done()
    })
    test('#DoubleFraction Error', (done) => {
        testHandler.getInput('1/2/2kg')
        assert.throws(testHandler.getValue, Error, 'invalid number')
        done()
    })
    test('#NoNumber defaults 1', (done) => {
        testHandler.getInput('kg')
        assert.isNumber(testHandler.getValue())
        done()
    })


    const validUnitsTest = testHandler.units

    test('#Read Valid Unit', (done) => {
        validUnitsTest.forEach(unit => {
            testHandler.getInput(unit[0])
            if (unit[0] === 'l') {
                assert.strictEqual(testHandler.getUnit(), unit[0].toUpperCase())
            } else {
                assert.strictEqual(testHandler.getUnit(), unit[0])
            }
        })
        done()
    })
        
    test('#Invalid Unit Error', (done) => {
        testHandler.inputUnit = ''
        testHandler.getInput('10ty')
        assert.throws(testHandler.getUnit, Error, 'invalid unit')
        done()
    })
        
    test('#Valid returnUnit', (done) => {
        validUnitsTest.forEach(unit => {
            let result = convertInputTests(unit[0])
            if (unit[0] === 'gal') {
                assert.strictEqual(result.returnUnit, unit[2].toUpperCase())
            } else {
                assert.strictEqual(result.returnUnit, unit[2])
            }
        })
        done()
    })
        
    test('#Espelled-out Name', (done) => {
        validUnitsTest.forEach(unit => {
            let result = convertInputTests(unit[0])
            assert.strictEqual(result.unitName, unit[1])
        })
        done()
    })

    test('#GalToLitter', (done) => {
        testHandler.getInput('20gal')
        assert.strictEqual(testHandler.convert().toUpperCase(), '75.7082L')
        done()
    })
    test('#LitterToGal', (done) => {
        testHandler.getInput('75.7L')
        assert.strictEqual(testHandler.convert(), '19.99783gal')
        done()
    })
    test('#MileToKm', (done) => {
        testHandler.getInput('6.2mi')
        let [ kilometers ] = testHandler.convert().split('km', 1)
        assert.approximately(Number(kilometers), 10, 0.03)
        done()
    })
    test('#KmToMile', (done) => {
        testHandler.getInput('10km')
        let [ miles ] = testHandler.convert().split('mi', 1)
        done()
        assert.approximately(Number(miles), 6.2, 0.02)
    })
    test('#KgToPound', (done) => {
        testHandler.getInput('10kg')
        assert.strictEqual(testHandler.convert(), '22.0462lbs')
        done()
    })
    test('#PoundToKg', (done) => {
        testHandler.getInput('22.0462lbs')
        assert.strictEqual(testHandler.convert(), '10kg')
        done()
    })
})
