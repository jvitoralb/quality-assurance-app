import chai from 'chai'
import ConvertHandler from '../controllers/convertHandler.js'


let assert = chai.assert
let handler = new ConvertHandler()
console.log('unit-tests')
suite('Input Tests', () => {
    test('Input Validation', () => {
        assert.strictEqual(handler.getValue('20kg'), 20)
        assert.strictEqual(handler.getValue('3.1kg'), 3.1)
        assert.strictEqual(handler.getValue(''), 1)
        assert.isNumber(handler.getValue('1/2kg'))
        assert.isNull(handler.getValue('1/2/2kg'))
    })

    const validUnitsTest = handler.units

    test('Unit Validation', () => {
        assert.isOk(handler.getUnit('kg'))
        assert.isNull(handler.getUnit('jg'))
        validUnitsTest.forEach(unit => assert.strictEqual(handler.getUnit(unit[0]), unit[0]))
        validUnitsTest.forEach(unit => {
            handler.getUnit(unit[0])
            assert.strictEqual(handler.getFullUnit(unit[1]), unit[1])
        })
    })
})

suite('Conversion Tests', () => {
    test('gal and L Tests', () => {
        handler.getInput('20gal')
        assert.strictEqual(handler.convert(), '75.7L')
        handler.getInput('75.7L')
        assert.strictEqual(handler.convert(), '20gal')
    })
    test('Km and Mile Tests', () => {
        handler.getInput('10km')
        let [ miles ] = handler.convert().split('mi', 1)
        assert.approximately(Number(miles), 6.2, 0.02)

        handler.getInput('6.2mi')
        let [ kilometers ] = handler.convert().split('km', 1)
        assert.approximately(Number(kilometers), 10, 0.03)
    })
    test('Kg and Pound Tests', () => {
        handler.getInput('15kg')
        assert.strictEqual(handler.convert(), '33.075lbs')
        handler.getInput('33.075lbs')
        assert.strictEqual(handler.convert(), '15kg')
    })
})