const chai = require('chai')
const chaiHttp = require('chai-http')


suite('Tracker Functional Tests', async () => {
    const app = (await import('../app.js')).default
    const dbConnection = (await import('../connection.js')).default

    const issuePath = '/issue-tracker/api/issues/tests-project-21'
    let assert = chai.assert

    chai.use(chaiHttp)
    dbConnection()

    suite('POST', () => {
        test('#Issue Tracker Home', (done) => {
            chai.request(app)
            .get('/issue-tracker')
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.equal(res.text, 'Hello Issue Tracker')
                done()
            })
        })
        const defaultDemo = {
            issue_title: 'Posting data error.',
            issue_text: 'When we post data it has an error.',
            created_by: 'zhuoang',
            assigned_to: 'yaci',
            status_text: 'In QA'
        }

        test('#Every field', (done) => {
            chai.request(app)
            .post(issuePath)
            .send(defaultDemo)
            .end((err, res) => {
                assert.equal(res.status, 201)
                assert.equal(res.type, 'application/json')
                assert.ownInclude(res.body, defaultDemo)
                assert.containsAllKeys(res.body, ['_id', 'created_on', 'updated_on', 'open'])
                done()
            })
        })
        test('#Only required fields', (done) => {
            const thisDemo = {
                ...defaultDemo,
                assigned_to: '',
                status_text: ''
            }

            chai.request(app)
            .post(issuePath)
            .send(thisDemo)
            .end((err, res) => {
                assert.equal(res.status, 201)
                assert.equal(res.type, 'application/json')
                assert.ownInclude(res.body, thisDemo)
                assert.containsAllKeys(res.body, ['_id', 'created_on', 'updated_on', 'open'])
                done()
            })
        })
        test('#With missing Required Fields', (done) => {
            chai.request(app)
            .post(issuePath)
            .send({
                issue_text: 'Posting data error.',
                created_by : 'zhuoang'
            })
            .end((err, res) => {
                // assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'required field(s) missing' })
                done()
            })
        })
    })
    suite('GET', () => {
        test('#Issues on Project', (done) => {
            chai.request(app)
            .get(issuePath)
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.equal(res.type, 'application/json')
                assert.isArray(res.body, 'Response should be an Array')
                res.body.forEach(val => {
                    assert.isObject(val, 'All values in response should be objects')
                    assert.containsAllKeys(val, ['_id', 'issue_title', 'issue_text', 'created_by'])
                })
                done()
            })
        })
        test('#Issues with one filter', (done) => {
            let query = { assigned_to: 'yaci' }

            chai.request(app)
            .get(`${issuePath}?${new URLSearchParams(query)}`)
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.equal(res.type, 'application/json')
                res.body.forEach(val =>
                    assert.deepOwnInclude(val, query, 'Values in response should equals to query request')
                )
                done()
            })
        })
        test('#Issues with two filters', (done) => {
            let query = { assigned_to: 'yaci', open: true }

            chai.request(app)
            .get(`${issuePath}?` + new URLSearchParams(query))
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.equal(res.type, 'application/json')
                res.body.forEach(val => assert.deepOwnInclude(val, query, 'Values in response should equals to query request'))
                done()
            })
        })
    })

    let issueId = ''

    suite('PUT', () => {
        test('#Get issue _id', (done) => {
            chai.request(app)
            // .post(issuePath)
            // .send({
            //     issue_title: 'Posting data error.',
            //     issue_text: 'When we post data it has an error.',
            //     created_by: 'zhuoang'
            // })
            // .end((err, res) => {
            //     assert.equal(res.status, 201)
            //     issueId = res.body._id
            //     assert.strictEqual(issueId, res.body._id, 'issueId should be equal to response _id')
            //     done()
            // })
            .get(issuePath)
            .end((err, res) => {
                let responseId = res.body.at(-1)._id
                issueId = responseId
                assert.strictEqual(issueId, responseId, 'issueId should be equal to response _id')
                done()
            })
        })
        test('#Update Issue Field', (done) => {
            chai.request(app)
            .put(issuePath)
            .send({
                issue_id: issueId,
                issue_title: 'Correcting issue_title_1'
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body, {
                    result: 'successfully updated',
                    _id: issueId
                }, 'issue_title should be updated')
                done()
            })
        })
        test('#Update Multiple Issue Fields', (done) => {
            chai.request(app)
            .put(issuePath)
            .send({
                issue_id: issueId,
                issue_title: 'Correcting issue_title_2',
                issue_text: 'Correcting issue_text_1'
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body, {
                    result: 'successfully updated',
                    _id: issueId
                }, 'issue_title and issue_text should be upated')
                done()
            })
        })
        test('#Update Issue with missing _id', (done) => {
            chai.request(app)
            .put(issuePath)
            .send({ issue_id: '' })
            .end((err, res) => {
                // assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'missing _id' })
                done()
            })
        })
        test('#Update Issue with no Fields', (done) => {
            chai.request(app)
            .put(issuePath)
            .send({ issue_id: issueId })
            .end((err, res) => {
                // assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: issueId })
                done()
            })
        })
        test('#Udpate Issue with invalid _id', (done) => {
            let demo = {
                issue_id: '000a000000000c0e00000a00',
                issue_title: 'Update with invalid _id'
            }

            chai.request(app)
            .put(issuePath)
            .send(demo)
            .end((err, res) => {
                // assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'could not update', _id: demo.issue_id })
                done()
            })
        })
    })
    suite('DELETE', () => {
        test('#Delete Issue', (done) => {
            chai.request(app)
            .delete(issuePath)
            .send({ issue_id: issueId })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body, { result: 'successfully deleted', _id: issueId })
                done()
            })
        })
        test('#Delete Issue with invalid _id', (done) => {
            let invalidId = '000a000000000c0e00000a00'

            chai.request(app)
            .delete(issuePath)
            .send({ issue_id: invalidId })
            .end((err, res) => {
                // assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'could not delete', _id: invalidId })
                done()
            })
        })
        test('#Delete Issue with missing _id', (done) => {
            chai.request(app)
            .delete(issuePath)
            .send('')
            .end((err, res) => {
                // assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'missing _id' })
                done()
            })
        })
    })
}).timeout(5000)