const chai = require('chai')

//1_unit-tests.cjs
suite('Unit Tests', async () => {
    const { ConvertHandler } = await import('../controllers/convertHandler.js')
    let testHandler = new ConvertHandler()
    let assert = chai.assert

    suite('Unit Tests - getNum', () => {
        test('#WholeNumber', (done) => {
            testHandler.validateInput('20kg')
            assert.strictEqual(testHandler.getValue(), 20)
            done()
        })
        test('#DecimalNumber', (done) => {
            testHandler.validateInput('3.1kg')
            assert.strictEqual(testHandler.getValue(), 3.1)
            done()
        })
        test('#Fraction', (done) => {
            testHandler.validateInput('1/2kg')
            assert.strictEqual(testHandler.getValue(), 0.5)
            done()
        })
        test('#Fraction With Decimal', (done) => {
            testHandler.validateInput('10.5/2kg')
            assert.isNumber(testHandler.getValue())
            done()
        })
        test('#DoubleFraction Error', (done) => {
            testHandler.validateInput('1/2/2kg')
            assert.Throw(() => testHandler.getValue(), 'invalid number')
            done()
        })
        test('#NoNumber defaults 1', (done) => {
            testHandler.validateInput('kg')
            assert.isNumber(testHandler.getValue())
            done()
        })
    })

    const unitsKeys = Object.keys(testHandler.units)

    suite('Unit Tests - getUnit', () => {
        test('#Read Valid Unit', (done) => {
            unitsKeys.forEach(unit => {
                let unitRes = (unit == 'l' ? unit.toUpperCase() : unit.toLowerCase())

                testHandler.validateInput(unit)
                assert.strictEqual(testHandler.getUnit(), unitRes)

                testHandler.validateInput(unit.toUpperCase())
                assert.strictEqual(testHandler.getUnit(), unitRes)
            })
            done()
        })

        test('#Invalid Unit Error', (done) => {
            testHandler.validateInput('10ty')
            assert.Throw(() => console.log(testHandler.getUnit()), 'invalid unit')
            done()
        })

        test('#Valid returnUnit', (done) => {
            unitsKeys.forEach(key => {
                testHandler.validateInput(key)
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
                testHandler.validateInput(key)
                let keyPair = testHandler.units[key]
                assert.strictEqual(testHandler.getUnitName(), keyPair[0])
            })
            done()
        })
    })

    suite('Unit Tests - Convert', () => {
        test('#GalToLitter', (done) => {
            testHandler.validateInput('5gal')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 18.9271, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '18.92705L')
            done()
        })

        test('#LitterToGal', (done) => {
            testHandler.validateInput('20L')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 5.2834, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '5.28344gal')
            done()
        })

        test('#MileToKm', (done) => {
            testHandler.validateInput('5mi')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 8.0467, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '8.0467km')
            done()
        })

        test('#KmToMile', (done) => {
            testHandler.validateInput('5km')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 3.1068, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '3.10686mi')
            done()
        })

        test('#KgToPound', (done) => {
            testHandler.validateInput('5kg')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 11.0231, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '11.02312lbs')
            done()
        })

        test('#PoundToKg', (done) => {
            testHandler.validateInput('10lbs')
            let result = testHandler.getAllValues()
            assert.approximately(result.returnNum, 4.5359, 0.0001)
            assert.strictEqual(result.returnNum + result.returnUnit, '4.53592kg')
            done()
        })
    })
})

const chaiHttp = require('chai-http')

// //2_functional-tests.cjs
suite('Functional Tests', async () => {
    const app = (await import('../app.js')).default
    const pathConvertAPI = '/metric-converter/api/convert'
    let assert = chai.assert

    chai.use(chaiHttp)

    suite('Home Page', () => {
        test('#Check HomePage Status', (done) => {
            chai.request(app)
            .get('/')
            .end((err, res) => {
                assert.equal(res.status, 200)
                done()
            })
        })
    })

    suite('Conversion - Functional Tests', () => {
        test('#Convert Valid Input', (done) => {
            chai.request(app)
            .get(`${pathConvertAPI}?input=10L`)
            .end((err, res) => {
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

        test('#Invalid Input', (done) => {
            chai.request(app)
            .get(`${pathConvertAPI}?input=5g`)
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.strictEqual(res.text, 'invalid unit')
                done()
            })
        })

        test('#Invalid Number', (done) => {
            chai.request(app)
            .get(`${pathConvertAPI}?input=3/7.2/5kg`)
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.strictEqual(res.text, 'invalid number')
                done()
            })
        })

        test('#Invalid Number and Unit', (done) => {
            chai.request(app)
            .get(`${pathConvertAPI}?input=3/7.2/5ml`)
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.strictEqual(res.text, 'invalid number and unit')
                done()
            })
        })

        test('#No Number Convert', (done) => {
            chai.request(app)
            .get(`${pathConvertAPI}?input=kg`)
            .end((err, res) => {
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