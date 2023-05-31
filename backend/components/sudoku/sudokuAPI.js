import { Router } from 'express';
import fcctesting from '../../routes/fcctesting.cjs';
import { checkPuzzle, validatePuzzle } from './sudokuMiddleware.js';
import { homeSudoku, checkSudoku, solveSudoku } from './sudokuController.js';


const sudokuSolver = Router();

sudokuSolver.get('/', homeSudoku);

sudokuSolver.use(validatePuzzle);

sudokuSolver.post('/api/v1/check', checkPuzzle, checkSudoku);
sudokuSolver.post('/api/v1/solve', solveSudoku);

fcctesting(sudokuSolver);

export default sudokuSolver;