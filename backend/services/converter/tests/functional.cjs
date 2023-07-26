const chai = require('chai')
const chaiHttp = require('chai-http')


suite('Functional Tests', async () => {
    const app = (await import('../../../app.js')).default
    const pathConvertAPI = '/metric-converter/api/v1/convert'
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
        test('#Invalid Unit', (done) => {
            chai.request(app)
            .get(`${pathConvertAPI}?input=5g`)
            .end((err, res) => {
                assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'invalid unit' })
                done()
            })
        })
        test('#Invalid Number', (done) => {
            chai.request(app)
            .get(`${pathConvertAPI}?input=3/7.2/5kg`)
            .end((err, res) => {
                assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'invalid number' })
                done()
            })
        })
        test('#Invalid Number and Unit', (done) => {
            chai.request(app)
            .get(`${pathConvertAPI}?input=3/7.2/5ml`)
            .end((err, res) => {
                assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'invalid number and unit' })
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
