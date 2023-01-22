import CustomError from '../errors/custom.js'
import { SudokuSolver, Cell } from '../services/sudoku.js'


export const checkPuzzle = (req, res, next) => {
    if (!req.body.coordinate || !req.body.value) {
        throw new CustomError('Required field(s) missing', 400, { field: (!req.body.coordinate ? 'coordinate' : 'value') })
    }

    try {
        const gameCell = new Cell(req.body.value, req.body.coordinate,  req.body.puzzle)
        gameCell.getStatus()
    } catch(e) {
        throw new CustomError(e.message, 400)
    }

    next()
}

export const validatePuzzle = (req, res, next) => {
    if (!req.body.puzzle) {
        throw new CustomError('Required field missing', 400, { field: 'puzzle' })
    }

    try {
        const sudoku = new SudokuSolver(null, req.body.puzzle)
        sudoku.validate()
    } catch(e) {
        throw new CustomError(e.message, 400)
    }

    next()
}