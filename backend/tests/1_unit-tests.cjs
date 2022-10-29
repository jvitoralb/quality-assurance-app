const chai = require('chai')


suite('Unit Tests', async () => {
    const { ConvertHandler } = await import('../controllers/convertHandler.js')
    let testHandler = new ConvertHandler()
    let assert = chai.assert

    test('whole number', () => {
        testHandler.getInput('20kg')
        assert.strictEqual(testHandler.getValue(), 20)
    })
    test('decimal number', () => {
        testHandler.getInput('3.1kg')
        assert.strictEqual(testHandler.getValue(), 3.1)
    })
    test('fractional input', () => {
        testHandler.getInput('1/2kg')
        assert.strictEqual(testHandler.getValue(), 0.5)
    })
    test('fractional input with decimal', () => {
        testHandler.getInput('10.5/2kg')
        assert.isNumber(testHandler.getValue())
    })
    test('error on double-fractional', () => {
        testHandler.getInput('1/2/2kg')
        assert.throws(testHandler.getValue, Error, 'invalid number')
    })
    test('default to 1 with no number input', () => {
        testHandler.getInput('kg')
        assert.isNumber(testHandler.getValue())
    })


    const validUnitsTest = testHandler.units

    test('Unit Validation', () => {
        validUnitsTest.forEach(unit => {
            testHandler.getInput(unit[0]) // AssertionError: expected 'L' to equal 'l'
            assert.strictEqual(testHandler.getUnit(), unit[0])
        })

        testHandler.inputUnit = ''
        testHandler.getInput('10ty')
        assert.throws(testHandler.getUnit, Error, 'invalid unit')

        validUnitsTest.forEach(unit => {
            let result = convertInputTests(unit[0])
            assert.strictEqual(result.returnUnit, unit[2])
        })

        validUnitsTest.forEach(unit => {
            let result = convertInputTests(unit[0])
            assert.strictEqual(result.unitName, unit[1])
        })
    })

    test('gal and L Tests', () => {
        testHandler.getInput('20gal')//AssertionError: expected '75.7082l' to equal '75.7082L'
        assert.strictEqual(testHandler.convert(), '75.7082L')
        testHandler.getInput('75.7L')
        assert.strictEqual(testHandler.convert(), '19.997gal')
    })
    test('Km and Mile Tests', () => {
        testHandler.getInput('10km')
        let [ miles ] = testHandler.convert().split('mi', 1)
        assert.approximately(Number(miles), 6.2, 0.02)

        testHandler.getInput('6.2mi')
        let [ kilometers ] = testHandler.convert().split('km', 1)
        assert.approximately(Number(kilometers), 10, 0.03)
    })
    test('Kg and Pound Tests', () => {
        testHandler.getInput('10kg')
        assert.strictEqual(testHandler.convert(), '22.0462lbs')
        testHandler.getInput('22.0462lbs')
        assert.strictEqual(testHandler.convert(), '10kg')
    })
})
