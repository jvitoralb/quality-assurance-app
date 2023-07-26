const chai = require('chai')
const chaiHttp = require('chai-http')


const assert = chai.assert

suite('Functional Tests', async function() {
    const app = (await import('../../../app.js')).default
    const pathAPI = '/english-translator/api/v1/translate'

    chai.use(chaiHttp)

    suite('Functional Tests - POST - /api/translate', function() {
        test('#Valid Text and Locale fields', function(done) {
            chai.request(app)
            .post(pathAPI)
            .send({ text: 'Mangoes are my favorite fruit.', locale: 'american-to-british' })
            .end(function(err, res) {
                assert.deepStrictEqual(res.status, 200)
                assert.strictEqual(res.type, 'application/json')
                assert.deepStrictEqual(res.body, {
                    text: 'Mangoes are my favorite fruit.',
                    translation: 'Mangoes are my <span class=\"highlight\">favourite</span> fruit.'
                })
                done()
            })
        })
        test('#Valid Text and Invalid Locale fields', function(done) {
            chai.request(app)
            .post(pathAPI)
            .send({ text: 'Mangoes are my favorite fruit.', locale: 'british' })
            .end(function(err, res) {
                assert.deepStrictEqual(res.status, 400)
                assert.deepEqual(res.body, { error: 'Invalid value for locale field' })
                done()
            })
        })
        test('#Missing Text field', function(done) {
            chai.request(app)
            .post(pathAPI)
            .send({ locale: 'american-to-british' })
            .end(function(err, res) {
                assert.deepStrictEqual(res.status, 400)
                assert.deepEqual(res.body, { error: 'Required field(s) missing' })
                done()
            })
        })
        test('#Missing Locale field', function(done) {
            chai.request(app)
            .post(pathAPI)
            .send({ text: 'Mangoes are my favorite fruit.' })
            .end(function(err, res) {
                assert.deepStrictEqual(res.status, 400)
                assert.deepEqual(res.body, { error: 'Required field(s) missing' })
                done()
            })
        })
        test('#Empty Text', function(done) {
            chai.request(app)
            .post(pathAPI)
            .send({ text: '', locale: 'british' })
            .end(function(err, res) {
                assert.deepStrictEqual(res.status, 200)
                assert.deepEqual(res.body, { error: 'No text to translate' })
                done()
            })
        })
        test('#No need to Translate Text', function(done) {
            chai.request(app)
            .post(pathAPI)
            .send({ text: 'Mangoes are my favourite fruit.', locale: 'american-to-british' })
            .end(function(err, res) {
                assert.deepStrictEqual(res.status, 200)
                assert.deepEqual(res.body, {
                    text: 'Mangoes are my favourite fruit.',
                    translation: 'Everything looks good to me!'
                })
                done()
            })
        })
    })
})