import { Router } from 'express';
// import fcctesting from '../../../fcctesting.cjs';
import { checkPuzzle, errorHandler, validatePuzzle } from './middlewares.js';
import { checkSudoku, solveSudoku } from './controllers.js';


const sudokuSolver = Router();

sudokuSolver.use(validatePuzzle);

sudokuSolver.post('/api/v1/check', checkPuzzle, checkSudoku);
sudokuSolver.post('/api/v1/solve', solveSudoku);

sudokuSolver.use(errorHandler);

// fcctesting(sudokuSolver);

export default sudokuSolver;