import express from 'express';
import errorHandler from './lib/error/handler.js';
import pathFrontend from './lib/pathConfig.js';
import sudokuSolver from './components/api/routes.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(pathFrontend));

app.use(sudokuSolver);

app.use(errorHandler);

export default app;