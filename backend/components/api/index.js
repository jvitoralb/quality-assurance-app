import issueTracker from '../../services/tracker/api/routes.js';
import imperialConverter from '../../services/converter/api/routes.js';
import personalLibrary from '../../services/library/api/routes.js';
import sudokuSolver from '../../services/sudoku/api/routes.js';
import translator from '../../services/translator/api/routes.js';
import { homepage } from './controllers.js';


const gateway = (app) => {
    app.get('/', homepage);
    app.use('/metric-converter', imperialConverter);
    app.use('/issue-tracker', issueTracker);
    app.use('/personal-library', personalLibrary);
    app.use('/sudoku-solver', sudokuSolver);
    app.use('/english-translator', translator);
}

export default gateway;