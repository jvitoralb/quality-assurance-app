const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('chai').expect


let assert = chai.assert
chai.use(chaiHttp)

suite('Functional Tests', async () => {
    const app = (await import('../app.js')).default
    const { convertInputTests } = await import('../controllers/convertHandler.js')

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
        const pathConvertAPI = '/metric-converter/api/convert'

        test('#Convert Valid Input', (done) => {
            let result = convertInputTests('10L')
            delete result.unitName

            chai.request(app)
            .get(`${pathConvertAPI}?input=10L`)
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body, result)
                done()
            })
        })

        test('#Invalid Input', (done) => {
            let result = convertInputTests('10g')

            chai.request(app)
            .get(`${pathConvertAPI}?input=10g`)
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.strictEqual(res.text, result.message)
                done()
            })
        })

        test('#Invalid Number', (done) => {
            let result = convertInputTests('3/7.2/5kg')

            chai.request(app)
            .get(`${pathConvertAPI}?input=3/7.2/5kg`)
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.strictEqual(res.text, result.message)
                done()
            })
        })

        test('#Invalid Number and Unit', (done) => {
            let result = convertInputTests('3/7.2/5ml')

            chai.request(app)
            .get(`${pathConvertAPI}?input=3/7.2/5ml`)
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.strictEqual(res.text, result.message)
                done()
            })
        })

        test('#No Number Convert', (done) => {
            let result = convertInputTests('kg')
            delete result.unitName

            chai.request(app)
            .get(`${pathConvertAPI}?input=kg`)
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body, result)
                done()
            })
        })
    })
})