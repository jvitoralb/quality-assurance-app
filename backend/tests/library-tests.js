import * as dotenv from 'dotenv'
import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../app.js'


chai.use(chaiHttp)

suite('Library Functional Tests', function() {
    const assert = chai.assert

    suite('Routing tests', function() {
        test('#Personal Library Home', function(done) {
            chai.request(app)
            .get('/personal-library')
            .end(function(err, res) {
                assert.strictEqual(res.status, 200)
                assert.strictEqual(res.text, 'Personal Library Home!')
                done()
            })
        })
        suite('POST', function() {
            let validId = ''

            test('#With title', function(done) {
                chai.request(app)
                .post('/personal-library/api/books')
                .send({ title: 'A volta dos que não foram' })
                .end(function(err, res) {
                    assert.strictEqual(res.status, 201)
                    assert.strictEqual(res.body.title, 'A volta dos que não foram')
                    assert.hasAllKeys(res.body, [ 'title', '_id' ], 'Response should have _id and title')
                    validId = res.body._id
                    done()
                })
            })
            test('#With no title', function(done) {
                chai.request(app)
                .post('/personal-library/api/books')
                .send({ })
                .end(function(err, res) {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'missing required field', field: 'title' })
                    done()
                })
            })
            test('#With Comment', function(done) {
                chai.request(app)
                .post('/personal-library/api/books/' + validId)
                .send({ text: 'This book is really good!' })
                .end(function(err, res) {
                    assert.strictEqual(res.status, 201)
                    assert.containsAllKeys(res.body[0], ['_id', 'title', 'comments'])
                    assert.strictEqual(res.body[0].comments.at(-1).text, 'This book is really good!')
                    done()
                })
            })
            test('#Without Comment', function(done) {
                chai.request(app)
                .post('/personal-library/api/books/' + validId)
                .send({ text: '' })
                .end(function(err, res) {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'missing required field', field: 'text' })
                    done()
                })
            })
            test('#With Invalid _id', function(done) {
                chai.request(app)
                .post('/personal-library/api/books/invalid_id')
                .send({ text: 'This book is amazing!!' })
                .end(function(err, res) {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'no book exists', _id: 'invalid_id' })
                    done()
                })
            })
        })
        suite('GET', function() {
            let validId = ''

            test('#Post The getter - A book', function(done) {
                chai.request(app)
                .post('/personal-library/api/books')
                .send({ title: 'The getter - A book' })
                .end(function(err, res) {
                    assert.strictEqual(res.status, 201)
                    validId = res.body._id
                    assert.strictEqual(res.body._id, validId)
                    done()
                })
            })
            test('#Book With Valid _id', function(done) {
                chai.request(app)
                .get('/personal-library/api/books/' + validId)
                .end(function(err, res) {
                    assert.strictEqual(res.status, 200)
                    assert.containsAllKeys(res.body[0], ['_id', 'title', 'comments'])
                    assert.isArray(res.body[0].comments)
                    done()
                })
            })
            test('#Book With Invalid _id', function(done) {
                chai.request(app)
                .get('/personal-library/api/books/invalid_id')
                .end(function(err, res) {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'no book exists', _id: 'invalid_id' })
                    done()
                })
            })
            test('#All Books', function(done) {
                chai.request(app)
                .get('/personal-library/api/books')
                .end(function(err, res) {
                    assert.strictEqual(res.status, 200)
                    assert.strictEqual(res.type, 'application/json')
                    assert.isArray(res.body, 'Response should be an array')
                    res.body.forEach(val => {
                        assert.isObject(val, 'All values in should be objects')
                        assert.containsAllKeys(val, ['_id', 'title', 'commentcount'])
                    })
                    done()
                })
            })
        })
        suite('DELETE', function() {
            let deleteId = ''
            test('#Create book to delete', function(done) {
                chai.request(app)
                .post('/personal-library/api/books')
                .send({ title: 'The book - Deletion' })
                .end(function(err, res) {
                    assert.strictEqual(res.status, 201)
                    deleteId = res.body._id
                    assert.strictEqual(res.body._id, deleteId, 'deleteId should equal body._id')
                    done()
                })
            })
            let commentId = ''
            test('#Create comment to delete', function(done) {
                chai.request(app)
                .post('/personal-library/api/books/' + deleteId)
                .send({ text: 'This comment should be deleted' })
                .end(function(err, res) {
                    assert.strictEqual(res.status, 201)
                    assert.strictEqual(res.body[0].comments.at(-1).text, 'This comment should be deleted')
                    commentId = res.body[0].comments.at(-1)._id
                    done()
                })
            })
            test('#Delete Comment', function(done) {
                chai.request(app)
                .delete('/personal-library/api/books/' + deleteId + '?comment=' + commentId)
                .end(function(err, res) {
                    assert.strictEqual(res.status, 200)
                    assert.strictEqual(res.body.message, 'comment deleted')
                    assert.strictEqual(res.body._id, commentId)
                    done()
                })
            })
            test('#Book With Valid _id', function(done) {
                chai.request(app)
                .delete('/personal-library/api/books/' + deleteId)
                .end(function(err, res) {
                    assert.strictEqual(res.status, 200)
                    assert.strictEqual(res.body.message, 'book delete successful')
                    assert.strictEqual(res.body._id, deleteId)
                    assert.hasAllDeepKeys(res.body, ['message', '_id', 'deletedCount', 'comments'])
                    done()
                })
            })
            test('#Book With Invalid _id', function(done) {
                chai.request(app)
                .delete('/personal-library/api/books/invalid_id')
                .end(function(err, res) {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'no book exists', _id: 'invalid_id' })
                    done()
                })
            })
            test('#All Books', function(done) {
                chai.request(app)
                .delete('/personal-library/api/books')
                .end(function(err, res) {
                    assert.strictEqual(res.status, 200)
                    assert.strictEqual(res.body.message, 'complete delete successful')
                    assert.hasAllDeepKeys(res.body, ['message', 'deletedCount', 'comments'])
                    done()
                })
            })
        })
    })
}).timeout(5000)