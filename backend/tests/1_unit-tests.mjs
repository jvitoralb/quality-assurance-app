import chai, { expect } from 'chai'
import ConvertHandler, { convertInputTests } from '../controllers/convertHandler.js'


let assert = chai.assert
// console.log('unit-tests')
let testHandler = new ConvertHandler()
suite('Unit Tests', () => {

    test('Input Validation', () => {
        testHandler.getInput('20kg')
        assert.strictEqual(testHandler.getValue(), 20)
        testHandler.getInput('3.1kg')
        assert.strictEqual(testHandler.getValue(), 3.1)
        testHandler.getInput('kg')
        assert.strictEqual(testHandler.getValue(), 1)
        testHandler.getInput('1/2kg')
        assert.isNumber(testHandler.getValue())
        testHandler.getInput('1/2/2kg')
        assert.throws(testHandler.getValue, Error, 'invalid number')
    })

    const validUnitsTest = testHandler.units

    test('Unit Validation', () => {
        validUnitsTest.forEach(unit => {
            testHandler.getInput(unit[0])
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
        testHandler.getInput('20gal')
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
        testHandler.getInput('15kg')
        assert.strictEqual(testHandler.convert(), '33.075lbs')
        testHandler.getInput('33.075lbs')
        assert.strictEqual(testHandler.convert(), '15kg')
    })
})
