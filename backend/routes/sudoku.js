import { Router } from 'express'


const sudokuSolver = Router()

sudokuSolver.get('/', (req, res, next) => {
    res.status(200).send('Hello Sudoku Solver!')
})

export default sudokuSolver