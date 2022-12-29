import * as dotenv from 'dotenv'
import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../app.js'


suite('Tracker Functional Tests', function() {
    const issuePath = '/issue-tracker/api/issues/tests-project-21'
    let assert = chai.assert

    chai.use(chaiHttp)

    suite('POST', function() {
        test('#Issue Tracker Home', function(done) {
            chai.request(app)
            .get('/issue-tracker')
            .end(function(err, res) {
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

        test('#Every field', function(done) {
            chai.request(app)
            .post(issuePath)
            .send(defaultDemo)
            .end(function(err, res) {
                assert.equal(res.status, 201)
                assert.equal(res.type, 'application/json')
                assert.ownInclude(res.body, defaultDemo)
                assert.containsAllKeys(res.body, ['_id', 'created_on', 'updated_on', 'open'])
                done()
            })
        })
        test('#Only required fields', function(done) {
            const thisDemo = {
                ...defaultDemo,
                assigned_to: '',
                status_text: ''
            }

            chai.request(app)
            .post(issuePath)
            .send(thisDemo)
            .end(function(err, res) {
                assert.equal(res.status, 201)
                assert.equal(res.type, 'application/json')
                assert.ownInclude(res.body, thisDemo)
                assert.containsAllKeys(res.body, ['_id', 'created_on', 'updated_on', 'open'])
                done()
            })
        })
        test('#With missing Required Fields', function(done) {
            chai.request(app)
            .post(issuePath)
            .send({
                issue_text: 'Posting data error.',
                created_by : 'zhuoang'
            })
            .end(function(err, res) {
                assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'required field(s) missing' })
                done()
            })
        })
    })
    suite('GET', function() {
        test('#Issues on Project', function(done) {
            chai.request(app)
            .get(issuePath)
            .end(function(err, res) {
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
        test('#Issues with one filter', function(done) {
            let query = { assigned_to: 'yaci' }

            chai.request(app)
            .get(`${issuePath}?${new URLSearchParams(query)}`)
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.type, 'application/json')
                res.body.forEach(val =>
                    assert.deepOwnInclude(val, query, 'Values in response should equals to query request')
                )
                done()
            })
        })
        test('#Issues with two filters', function(done) {
            let query = { assigned_to: 'yaci', open: true }

            chai.request(app)
            .get(`${issuePath}?` + new URLSearchParams(query))
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.type, 'application/json')
                res.body.forEach(val => assert.deepOwnInclude(val, query, 'Values in response should equals to query request'))
                done()
            })
        })
    })

    let issueId = ''

    suite('PUT', function() {
        test('#Get issue _id', function(done) {
            chai.request(app)
            .post(issuePath)
            .send({
                issue_title: 'Posting data error.',
                issue_text: 'When we post data it has an error.',
                created_by: 'zhuoang'
            })
            .end(function(err, res) {
                assert.equal(res.status, 201)
                issueId = res.body._id
                assert.strictEqual(issueId, res.body._id, 'issueId should be equal to response _id')
                done()
            })
        })
        test('#Update Issue Field', function(done) {
            chai.request(app)
            .put(issuePath)
            .send({
                issue_id: issueId,
                issue_title: 'Correcting issue_title_1'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body, {
                    result: 'successfully updated',
                    _id: issueId
                }, 'issue_title should be updated')
                done()
            })
        })
        test('#Update Multiple Issue Fields', function(done) {
            chai.request(app)
            .put(issuePath)
            .send({
                issue_id: issueId,
                issue_title: 'Correcting issue_title_2',
                issue_text: 'Correcting issue_text_1'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body, {
                    result: 'successfully updated',
                    _id: issueId
                }, 'issue_title and issue_text should be upated')
                done()
            })
        })
        test('#Update Issue with missing _id', function(done) {
            chai.request(app)
            .put(issuePath)
            .send({ issue_id: '' })
            .end(function(err, res) {
                assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'missing _id' })
                done()
            })
        })
        test('#Update Issue with no Fields', function(done) {
            chai.request(app)
            .put(issuePath)
            .send({ issue_id: issueId })
            .end(function(err, res) {
                assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: issueId })
                done()
            })
        })
        test('#Udpate Issue with invalid _id', function(done) {
            let demo = {
                issue_id: '000a000000000c0e00000a00',
                issue_title: 'Update with invalid _id'
            }

            chai.request(app)
            .put(issuePath)
            .send(demo)
            .end(function(err, res) {
                assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'could not update', _id: demo.issue_id })
                done()
            })
        })
    })
    suite('DELETE', function() {
        test('#Delete Issue', function(done) {
            chai.request(app)
            .delete(issuePath)
            .send({ issue_id: issueId })
            .end(function(err, res) {
                assert.equal(res.status, 200)
                assert.deepEqual(res.body, { result: 'successfully deleted', _id: issueId })
                done()
            })
        })
        test('#Delete Issue with invalid _id', function(done) {
            let invalidId = '000a000000000c0e00000a00'

            chai.request(app)
            .delete(issuePath)
            .send({ issue_id: invalidId })
            .end(function(err, res) {
                assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'could not delete', _id: invalidId })
                done()
            })
        })
        test('#Delete Issue with missing _id', function(done) {
            chai.request(app)
            .delete(issuePath)
            .send('')
            .end(function(err, res) {
                assert.equal(res.status, 400)
                assert.deepEqual(res.body, { error: 'missing _id' })
                done()
            })
        })
    })
}).timeout(5000)