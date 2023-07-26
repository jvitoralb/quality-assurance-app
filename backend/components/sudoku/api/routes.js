import { Router } from 'express';
import fcctesting from '../../../fcctesting.cjs';
import { checkPuzzle, validatePuzzle } from './middlewares.js';
import { homeSudoku, checkSudoku, solveSudoku } from './controllers.js';


const sudokuSolver = Router();

sudokuSolver.get('/', homeSudoku);

sudokuSolver.use(validatePuzzle);

sudokuSolver.post('/api/v1/check', checkPuzzle, checkSudoku);
sudokuSolver.post('/api/v1/solve', solveSudoku);

fcctesting(sudokuSolver);

export default sudokuSolver;