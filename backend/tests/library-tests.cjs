require('dotenv').config()
const chai = require('chai')
const chaiHttp = require('chai-http')


if (process.env.PROJECT_TEST !== 'library') return

chai.use(chaiHttp)

suite('Library Functional Tests', async () => {
    const app = (await import('../app.js')).default
    let assert = chai.assert

    suite('Routing tests', () => {
        test('#Personal Library Home', (done) => {
            chai.request(app)
            .get('/personal-library')
            .end((err, res) => {
                assert.strictEqual(res.status, 200)
                assert.strictEqual(res.text, 'Personal Library Home!')
                done()
            })
        })
        suite('POST', () => {
            let validId = ''

            test('#With title', (done) => {
                chai.request(app)
                .post('/personal-library/api/books')
                .send({ title: 'A volta dos que não foram' })
                .end((err, res) => {
                    assert.strictEqual(res.status, 201)
                    assert.strictEqual(res.body.title, 'A volta dos que não foram')
                    assert.hasAllKeys(res.body, [ 'title', '_id' ], 'Response should have _id and title')
                    validId = res.body._id
                    done()
                })
            })
            test('#With no title', (done) => {
                chai.request(app)
                .post('/personal-library/api/books')
                .send({ })
                .end((err, res) => {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'missing required field', field: 'title' })
                    done()
                })
            })
            test('#With Comment', (done) => {
                chai.request(app)
                .post('/personal-library/api/books/' + validId)
                .send({ text: 'This book is really good!' })
                .end((err, res) => {
                    assert.strictEqual(res.status, 201)
                    assert.containsAllKeys(res.body[0], ['_id', 'title', 'comments'])
                    assert.strictEqual(res.body[0].comments.at(-1).text, 'This book is really good!')
                    done()
                })
            })
            test('#Without Comment', (done) => {
                chai.request(app)
                .post('/personal-library/api/books/' + validId)
                .send({ text: '' })
                .end((err, res) => {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'missing required field', field: 'text' })
                    done()
                })
            })
            test('#With Invalid _id', (done) => {
                chai.request(app)
                .post('/personal-library/api/books/invalid_id')
                .send({ text: 'This book is amazing!!' })
                .end((err, res) => {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'no book exists', _id: 'invalid_id' })
                    done()
                })
            })
        })
        suite('GET', () => {
            let validId = ''

            test('#Post The getter - A book', (done) => {
                chai.request(app)
                .post('/personal-library/api/books')
                .send({ title: 'The getter - A book' })
                .end((err, res) => {
                    assert.strictEqual(res.status, 201)
                    validId = res.body._id
                    assert.strictEqual(res.body._id, validId)
                    done()
                })
            })
            test('#Book With Valid _id', (done) => {
                chai.request(app)
                .get('/personal-library/api/books/' + validId)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200)
                    assert.containsAllKeys(res.body[0], ['_id', 'title', 'comments'])
                    assert.isArray(res.body[0].comments)
                    done()
                })
            })
            test('#Book With Invalid _id', (done) => {
                chai.request(app)
                .get('/personal-library/api/books/invalid_id')
                .end((err, res) => {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'no book exists', _id: 'invalid_id' })
                    done()
                })
            })
            test('#All Books', (done) => {
                chai.request(app)
                .get('/personal-library/api/books')
                .end((err, res) => {
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
        suite('DELETE', () => {
            let deleteId = ''
            test('#Create book to delete', (done) => {
                chai.request(app)
                .post('/personal-library/api/books')
                .send({ title: 'The book - Deletion' })
                .end((err, res) => {
                    assert.strictEqual(res.status, 201)
                    deleteId = res.body._id
                    assert.strictEqual(res.body._id, deleteId, 'deleteId should equal body._id')
                    done()
                })
            })
            let commentId = ''
            test('#Create comment to delete', (done) => {
                chai.request(app)
                .post('/personal-library/api/books/' + deleteId)
                .send({ text: 'This comment should be deleted' })
                .end((err, res) => {
                    assert.strictEqual(res.status, 201)
                    assert.strictEqual(res.body[0].comments.at(-1).text, 'This comment should be deleted')
                    commentId = res.body[0].comments.at(-1)._id
                    done()
                })
            })
            test('#Delete Comment', (done) => {
                chai.request(app)
                .delete('/personal-library/api/books/' + deleteId + '?comment=' + commentId)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200)
                    assert.strictEqual(res.body.message, 'comment deleted')
                    assert.strictEqual(res.body._id, commentId)
                    done()
                })
            })
            test('#Book With Valid _id', (done) => {
                chai.request(app)
                .delete('/personal-library/api/books/' + deleteId)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200)
                    assert.strictEqual(res.body.message, 'book delete successful')
                    assert.strictEqual(res.body._id, deleteId)
                    assert.hasAllDeepKeys(res.body, ['message', '_id', 'deletedCount', 'comments'])
                    done()
                })
            })
            test('#Book With Invalid _id', (done) => {
                chai.request(app)
                .delete('/personal-library/api/books/invalid_id')
                .end((err, res) => {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'no book exists', _id: 'invalid_id' })
                    done()
                })
            })
            test('#All Books', (done) => {
                chai.request(app)
                .delete('/personal-library/api/books')
                .end((err, res) => {
                    assert.strictEqual(res.status, 200)
                    assert.strictEqual(res.body.message, 'complete delete successful')
                    assert.hasAllDeepKeys(res.body, ['message', 'deletedCount', 'comments'])
                    done()
                })
            })
        })
    })
}).timeout(5000)