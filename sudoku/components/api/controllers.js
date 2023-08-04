import { SudokuSolver, Cell } from '../service/services.js';
import pathFrontend from '../../lib/pathConfig.js';


export const sudokuHome = (req, res, next) => {
    res.status(200).sendFile(`${pathFrontend}/public/sudoku.html`);
}

export const solveSudoku = (req, res, next) => {
    const { puzzle } = req.body;
    const solverRef = new SudokuSolver(null, puzzle);
    const answer = solverRef.getSolution();

    res.status(200).json(answer);
}

export const checkSudoku = (req, res, next) => {
    const { puzzle, coordinate, value } = req.body;
    const cellRef = new Cell(value, coordinate, puzzle);
    const answer = cellRef.check();

    res.status(200).json(answer);
}