import issueTracker from '../../../tracker/components/api/routes.js';
import imperialConverter from '../../../converter/components/api/routes.js';
import personalLibrary from '../../../library/components/api/routes.js';
import sudokuSolver from '../../../sudoku/components/api/routes.js';
import translator from '../../../translator/components/api/routes.js';
import {
    homepage,
    converterHome,
    trackerHome,
    libraryHome,
    sudokuHome,
    translatorHome
} from './controllers.js';


const gateway = (app) => {
    app.get('/', homepage);

    app.get('/metric-converter', converterHome);
    app.use('/metric-converter', imperialConverter); // the proxy goes here

    app.get('/issue-tracker', trackerHome);
    app.use('/issue-tracker', issueTracker); // the proxy goes here

    app.get('/personal-library', libraryHome);
    app.use('/personal-library', personalLibrary); // the proxy goes here

    app.get('/sudoku-solver', sudokuHome);
    app.use('/sudoku-solver', sudokuSolver); // the proxy goes here

    app.get('/english-translator', translatorHome);
    app.use('/english-translator', translator); // the proxy goes here
}

export default gateway;