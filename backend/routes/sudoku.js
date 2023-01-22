import { Router } from 'express'
import fcctesting from './fcctesting.cjs'
import { checkSudoku, solveSudoku } from '../controllers/sudoku.js'
import { checkPuzzle, validatePuzzle } from '../middleware/sudoku.js'


const sudokuSolver = Router()

sudokuSolver.get('/', (req, res, next) => {
    res.status(200).send('Hello Sudoku Solver!')
})

sudokuSolver.use(validatePuzzle)

sudokuSolver.post('/api/v1/check', checkPuzzle, checkSudoku)

sudokuSolver.post('/api/v1/solve', solveSudoku)

fcctesting(sudokuSolver)

export default sudokuSolver