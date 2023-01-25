import { Router } from 'express';
import fcctesting from './fcctesting.cjs';
import { checkPuzzle, validatePuzzle } from '../middleware/sudoku.js';
import { homeSudoku, checkSudoku, solveSudoku } from '../controllers/sudoku.js';


const sudokuSolver = Router();

sudokuSolver.get('/', homeSudoku);

//fcc tests
sudokuSolver.post('/api/check', checkPuzzle, checkSudoku);
sudokuSolver.post('/api/solve', validatePuzzle, solveSudoku);

// sudokuSolver.use(validatePuzzle);

// sudokuSolver.post('/api/v1/check', checkPuzzle, checkSudoku);
// sudokuSolver.post('/api/v1/solve', solveSudoku);

fcctesting(sudokuSolver);

export default sudokuSolver;