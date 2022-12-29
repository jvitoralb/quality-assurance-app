import * as dotenv from 'dotenv'
import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../app.js'
import { ConvertHandler } from '../controllers/converter.js'


//1_unit-tests.cjs
suite('Unit Tests', function() {
    let assert = chai.assert

    suite('Unit Tests - getNum', function() {
        test('#WholeNumber', function(done) {
            let testHandler = new ConvertHandler('20', 'kg')
            assert.strictEqual(testHandler.getValue(), 20)
            done()
        })
        test('#DecimalNumber', function(done) {
            let testHandler = new ConvertHandler('3.1', 'kg')
            assert.strictEqual(testHandler.getValue(), 3.1)
            done()
        })
        test('#Fraction', function(done) {
            let testHandler = new ConvertHandler('1/2', 'kg')
            assert.strictEqual(testHandler.getValue(), 0.5)
            done()
        })
        test('#Fraction With Decimal', function(done) {
            let testHandler = new ConvertHandler('10.5/2', 'kg')
            assert.isNumber(testHandler.getValue())
            done()
        })
        test('#DoubleFraction Error', function(done) {
            let testHandler = new ConvertHandler('1/2/2', 'kg')
            assert.Throw(() => testHandler.getValue(), 'invalid number')
            done()
        })
        test('#NoNumber defaults 1', function(done) {
            let testHandler = new ConvertHandler('', 'kg')
            assert.isNumber(testHandler.getValue())
            done()
        })
    })

    const unitsKeys = Object.keys(new ConvertHandler().units)

    suite('Unit Tests - getUnit', function() {
        test('#Read Valid Unit', function(done) {
            unitsKeys.forEach(unit => {
                let unitRes = (unit == 'l' ? unit.toUpperCase() : unit.toLowerCase())

                let testHandler = new ConvertHandler('', unit)
                assert.strictEqual(testHandler.getUnit(), unitRes)

                testHandler.inputUnit = unit.toUpperCase()
                assert.strictEqual(testHandler.getUnit(), unitRes)
            })
            done()
        })
        test('#Invalid Unit Error', function(done) {
            let testHandler = new ConvertHandler('10', 'ty')
            assert.throws(() => testHandler.getUnit(), 'invalid unit')
            done()
        })
        test('#Valid returnUnit', function(done) {
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

    suite('Unit Tests - getUnitName', function() {
        test('#Each Unit Name', function(done) {
            unitsKeys.forEach(key => {
                let testHandler = new ConvertHandler('', key)
                let keyPair = testHandler.units[key]
                assert.strictEqual(testHandler.getUnitName(), keyPair[0])
            })
            done()
        })
    })

    suite('Unit Tests - Convert', function() {
        test('#GalToLitter', function(done) {
            let testHandler = new ConvertHandler('5', 'gal')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 18.9271, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '18.92705L')
            done()
        })
        test('#LitterToGal', function(done) {
            let testHandler = new ConvertHandler('20', 'L')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 5.2834, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '5.28344gal')
            done()
        })
        test('#MileToKm', function(done) {
            let testHandler = new ConvertHandler('5', 'mi')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 8.0467, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '8.0467km')
            done()
        })
        test('#KmToMile', function(done) {
            let testHandler = new ConvertHandler('5', 'km')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 3.1068, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '3.10686mi')
            done()
        })
        test('#KgToPound', function(done) {
            let testHandler = new ConvertHandler('5', 'kg')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 11.0231, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '11.02312lbs')
            done()
        })
        test('#PoundToKg', function(done) {
            let testHandler = new ConvertHandler('10', 'lbs')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 4.5359, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '4.53592kg')
            done()
        })
    })
})

// //2_functional-tests.cjs
suite('Functional Tests', function() {
    const pathConvertAPI = '/metric-converter/api/convert'
    let assert = chai.assert

    chai.use(chaiHttp)

    suite('Home Page', function() {
        test('#Check HomePage Status', function(done) {
            chai.request(app)
            .get('/')
            .end(function(err, res) {
                assert.equal(res.status, 200)
                done()
            })
        })
    })

    suite('Conversion - Functional Tests', function() {
        test('#Convert Valid Input', function(done) {
            chai.request(app)
            .get(`${pathConvertAPI}?input=10L`)
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body, {
                    initNum: 10,
                    initUnit: 'L',
                    returnNum: 2.64172,
                    returnUnit: 'gal',
                    string: '10 liters converts to 2.64172 gallons'
                })
                done()
            })
        })
        test('#Invalid Unit', function(done) {
            chai.request(app)
            .get(`${pathConvertAPI}?input=5g`)
            .end(function(err, res) {
                assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'invalid unit' })
                done()
            })
        })
        test('#Invalid Number', function(done) {
            chai.request(app)
            .get(`${pathConvertAPI}?input=3/7.2/5kg`)
            .end(function(err, res) {
                assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'invalid number' })
                done()
            })
        })
        test('#Invalid Number and Unit', function(done) {
            chai.request(app)
            .get(`${pathConvertAPI}?input=3/7.2/5ml`)
            .end(function(err, res) {
                assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'invalid number and unit' })
                done()
            })
        })
        test('#No Number Convert', function(done) {
            chai.request(app)
            .get(`${pathConvertAPI}?input=kg`)
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body, {
                    initNum: 1,
                    initUnit: 'kg',
                    returnNum: 2.20462,
                    returnUnit: 'lbs',
                    string: '1 kilograms converts to 2.20462 pounds'
                })
                done()
            })
        })
    })
})