const chai = require('chai')
const chaiHttp = require('chai-http')


const assert = chai.assert
const puzzlesAndSolutions = [
    [
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
      '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
    ],
    [
      '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
      '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
    ],
    [
      '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
      '218396745753284196496157832531672984649831257827549613962415378185763429374928561'
    ],
    [
      '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
      '473891265851726394926345817568913472342687951197254638734162589685479123219538746'
    ],
    [
      '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
      '827549163531672894649831527496157382218396475753284916962415738185763249374928651'
    ]
]

chai.use(chaiHttp)

suite('Functional Tests', async function() {
    const app = (await import('../../gateway/app.js')).default
    const pathApi = '/sudoku-solver/api/v1'

    suite('Homepage', function() {
        test('#Get Homepage', function(done) {
            chai.request(app)
            .get('/sudoku-solver')
            .end(function(err, res) {
                assert.strictEqual(res.status, 200)
                done()
            })
        })
    })
    suite('Post to /api/check', function() {
        test('#All Fields', function(done) {
            chai.request(app)
            .post(`${pathApi}/check`)
            .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'A1', value: 5 })
            .end(function(err, res) {
                assert.strictEqual(res.status, 200)
                assert.deepEqual(res.body, { valid: true })
                done()
            })
        })
        test('#Single Conflict', function(done) {
            chai.request(app)
            .post(`${pathApi}/check`)
            .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'E5', value: 6 })
            .end(function(err, res) {
                assert.strictEqual(res.status, 200)
                assert.deepEqual(res.body, { valid: false, conflict: ['row'] })
                done()
            })
        })
        test('#Multiple Conflicts', function(done) {
            chai.request(app)
            .post(`${pathApi}/check`)
            .send({ puzzle: puzzlesAndSolutions[2][0], coordinate: 'D3', value: 6 })
            .end(function(err, res) {
                assert.strictEqual(res.status, 200)
                assert.deepEqual(res.body, { valid: false, conflict: ['row', 'region'] })
                done()
            })
        })
        test('#All Conflicts', function(done) {
            chai.request(app)
            .post(`${pathApi}/check`)
            .send({ puzzle: puzzlesAndSolutions[2][0], coordinate: 'D5', value: 2 })
            .end(function(err, res) {
                assert.strictEqual(res.status, 200)
                assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column', 'region'] })
                done()
            })
        })
        test('#Missing Fields', function(done) {
            chai.request(app)
            .post(`${pathApi}/check`)
            .send({ puzzle: puzzlesAndSolutions[3][0], coordinate: 'D5', value: '' })
            .end(function(err, res) {
                assert.strictEqual(res.status, 400)
                assert.deepEqual(res.body, { error: 'Required field(s) missing', field: 'value' })
                done()
            })
        })
        test('#Invalid Characters', function(done) {
            chai.request(app)
            .post(`${pathApi}/check`)
            .send({
                puzzle: 'a.b..c.d4..63.12.7.2..5,,,,.9..1,,,,d.d.gggg.3.7.2..9.ee...8..1..16,,,,wwssad.37.',
                coordinate: 'D5',
                value: 3
            })
            .end(function(err, res) {
                assert.strictEqual(res.status, 400)
                assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' })
                done()
            })
        })
        test('#Invalid Length', function(done) {
            chai.request(app)
            .post(`${pathApi}/check`)
            .send({
                puzzle: '82..4..6...16..89...98315.749.157.............................53..4...96.415..81..7632..3...28.51',
                coordinate: 'E3',
                value: 5
            })
            .end(function(err, res) {
                assert.strictEqual(res.status, 400)
                assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' })
                done()
            })
        })
        test('#Invalid Coordinate', function(done) {
            chai.request(app)
            .post(`${pathApi}/check`)
            .send({ puzzle: puzzlesAndSolutions[4][0], coordinate: 'P4', value: 8 })
            .end(function(err, res) {
                assert.strictEqual(res.status, 400)
                assert.deepEqual(res.body, { error: 'Invalid coordinate' })
                done()
            })
        })
        test('#Invalid Value', function(done) {
            chai.request(app)
            .post(`${pathApi}/check`)
            .send({ puzzle: puzzlesAndSolutions[4][0], coordinate: 'P4', value: 22 })
            .end(function(err, res) {
                assert.strictEqual(res.status, 400)
                assert.deepEqual(res.body, { error: 'Invalid value' })
                done()
            })
        })
    })
    suite('Post to /api/solve', function() {
        test('#Valid Puzzle String', function(done) {
            chai.request(app)
            .post(`${pathApi}/solve`)
            .send({ puzzle: puzzlesAndSolutions[4][0] })
            .end(function(err, res) {
                assert.strictEqual(res.status, 200)
                assert.strictEqual(res.body.solution, puzzlesAndSolutions[4][1])
                done()
            })
        })
        test('#Missing Puzzle', function(done) {
            chai.request(app)
            .post(`${pathApi}/solve`)
            .send({ puzzle: '' })
            .end(function(err, res) {
                assert.strictEqual(res.status, 400)
                assert.deepEqual(res.body, { error: 'Required field missing', field: 'puzzle' })
                done()
            })
        })
        test('#Invalid Characters', function(done) {
            chai.request(app)
            .post(`${pathApi}/solve`)
            .send({ puzzle: 'a.b..c.d4..63.12.7.2..5,,,,.9..1,,,,d.d.gggg.3.7.2..9.ee...8..1..16,,,,wwssad.37.' })
            .end(function(err, res) {
                assert.strictEqual(res.status, 400)
                assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' })
                done()
            })
        })
        test('#Invalid Length', function(done) {
            chai.request(app)
            .post(`${pathApi}/solve`)
            .send({ puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.' })
            .end(function(err, res) {
                assert.strictEqual(res.status, 400)
                assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' })
                done()
            })
        })
        test('#Not solvable', function(done) {
            chai.request(app)
            .post(`${pathApi}/solve`)
            .send({ puzzle: '.7.89.....5....3.4.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.3..7.8' })
            .end(function(err, res) {
                assert.strictEqual(res.status, 200)
                assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' })
                done()
            })
        })
    })
})