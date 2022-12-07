const chai = require('chai')
const chaiHttp = require('chai-http')


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
            let validId

            test('#With title', (done) => {
                chai.request(app)
                .post('/personal-library/api/books')
                .send({ title: 'A volta dos que não foram'})
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
                    assert.deepEqual(res.body, { error: 'missing required field title' }) //separate whats missing from error
                    done()
                })
            })
            test('#With Comment', (done) => {
                chai.request(app)
                .post('/personal-library/api/books/' + validId)
                .send({ comment: 'This book is really good!' })
                .end((err, res) => {
                    assert.strictEqual(res.status, 201)
                    assert.containsAllKeys(res.body, ['_id', 'title', 'comments'])
                    assert.strictEqual(res.body.comments.at(-1), 'This book is really good!')
                    done()
                })
            })
            test('#Without Comment', (done) => {
                chai.request(app)
                .post('/personal-library/api/books/' + validId)
                .send({ })
                .end((err, res) => {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'missing required field comment'}) //separate whats missing from error
                    done()
                })
            })
            test('#With Invalid _id', (done) => {
                chai.request(app)
                .post('/personal-library/api/books/invalid_id')
                .send({ comment: 'This book is amazing!!' })
                .end((err, res) => {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'no book exists' }) // I should assert for _id in the error object as well
                    done()
                })
            })
        })
        suite('GET', () => {
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
            test('#Book With Invalid _id', (done) => {
                chai.request(app)
                .get('/personal-library/api/book/invalid_id')
                .end((err, res) => {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'no book exists' })//I should assert for _id in the error object as well
                    done()
                })
            })
            test('#Book With Valid _id', (done) => {
                let validId
                chai.request(app)
                .post('/personal-library/api/books')
                .send({ title: 'The getter - A book' })
                .end((err, res) => {
                    assert.strictEqual(res.status, 201, 'Book to delete created!')
                    validId = res.body._id
                })

                chai.request(app)
                .get('/personal-library/api/books/' + validId)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200)
                    assert.containsAllKeys(res.body, ['_id', 'title', 'comments'])
                    assert.isArray(res.body.comments)
                    done()
                })
            })
        })
        suite('DELETE', () => {
            test('#Book With Valid _id', (done) => {
                let deleteId
                chai.request(app)
                .post('/personal-library/api/books')
                .send({ title: 'The book - Deletion' })
                .end((err, res) => {
                    assert.strictEqual(res.status, 201, 'Book to delete created!')
                    deleteId = res.body._id
                })

                chai.request(app)
                .delete('/personal-library/api/books')
                .end((err, res) => {
                    assert.strictEqual(res.status, 200)
                    assert.deepEqual(res.body, { message: 'delete successful' })//I should assert for the title as well
                    done()
                })
            })
            test('#Book With Invalid _id', (done) => {
                chai.request(app)
                .delete('/personal-library/api/books/not_valid_id')
                .end((err, res) => {
                    assert.strictEqual(res.status, 400)
                    assert.deepEqual(res.body, { error: 'no book exists' })//I should assert for _id in the error object as well
                    done()
                })
            })
            test('#All Books', (done) => {
                chai.request(app)
                .delete('/personal-library/api/books')
                .end((err, res) => {
                    assert.strictEqual(res.status, 200)
                    assert.deepEqual(res.body, { message: 'complete delete successful' })
                    done()
                })
            })
        })
    })
})