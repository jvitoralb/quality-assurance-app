const chai = require('chai')

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

suite('Unit Tests', async function() {
    const { SudokuSolver, Cell } = await import('../components/service/services.js')

    suite('Unit Tests - Validate Puzzle', function() {
        const validationRef = new SudokuSolver(null, puzzlesAndSolutions[0][0])
        test('#Valid String Length', function(done) {
            let { valid } = validationRef.validate()
            assert.isTrue(valid, 'Calling .validate() on puzzle should return true')
            done()
        })
        test('#Invalid String Characters', function(done) {
            validationRef.puzzle = 'a.b..c.d4..63.12.7.2..5,,,,.9..1,,,,d.d.gggg.3.7.2..9.ee...8..1..16,,,,wwssad.37.'
            assert.throw(() => validationRef.validate(), 'Invalid characters in puzzle','', 'Should throw a error message')
            done()
        })
        test('#Invalid String Length', function(done) {
            validationRef.puzzle = '1.5..2.84..63.12.7.2..5.....9..1....'
            assert.throw(() => validationRef.validate(), 'Expected puzzle to be 81 characters long','', 'Should throw a error message')
            done()
        })
    })
    suite('Unit Tests - Check Puzzle', function() {
        const checkRef = new Cell('', '.', puzzlesAndSolutions[0][0])
        test('#Valid Row placement', function(done) {
            checkRef.setCoordinate(0)
            checkRef.setValue(1)
            assert.isTrue(checkRef.check().valid, 'Calling .check() should return { valid: true }')
            done()
        })
        test('#Invalid Row placement', function(done) {
            checkRef.setValue(5)
            let result = checkRef.check()
            assert.isNotTrue(result.valid, 'valid should not equals true')
            assert.include(result.conflict, 'row', 'Conflict array should include row string')
            done()
        })
        test('#Valid Column placement', function(done) {
            checkRef.setCoordinate(12)
            checkRef.setValue(3)
            assert.isTrue(checkRef.check().valid, 'Calling .check() should return { valid: true }')
            done()
        })
        test('#Invalid Column placement', function(done) {
            checkRef.setCoordinate(20)
            checkRef.setValue(9)
            let result = checkRef.check()
            assert.isNotTrue(result.valid, 'result.valid should not equals true')
            assert.include(result.conflict, 'column', 'Conflict array should include column string')
            done()
        })
        test('#Valid Region placement', function(done) {
            checkRef.setCoordinate(64)
            checkRef.setValue(3)
            assert.isTrue(checkRef.check().valid, 'Calling .check() should return { valid: true }')
            done()
        })
        test('#Invalid Region placement', function(done) {
            checkRef.setCoordinate(64)
            checkRef.setValue(9)
            let result = checkRef.check()
            assert.isNotTrue(result.valid, 'valid should not equals true')
            assert.include(result.conflict, 'column', 'Conflict array should include region string')
            done()
        })
    })
    suite('Unit Tests - Solve Puzzle', function() {
        const solveRef = new SudokuSolver()
        test('#Valid puzzle string', function(done) {
            solveRef.puzzle = puzzlesAndSolutions[2][0]
            assert.strictEqual(solveRef.getSolution().solution, puzzlesAndSolutions[2][1])
            done()
        })
        test('#Invalid puzzle string', function(done) {
            solveRef.puzzle = '1.5..2.84..63.12.7.2..5.....9..1....'
            assert.throw(() => solveRef.getSolution(), 'Expected puzzle to be 81 characters long', '', 'Calling solveRef.solve() should throw an Error')
            done()
        })
        test('#Solve incomplete puzzle', function(done) {
            solveRef.puzzle = puzzlesAndSolutions[3][0]
            assert.strictEqual(solveRef.getSolution().solution, puzzlesAndSolutions[3][1])
            done()
        })
    })
})