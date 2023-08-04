import * as dotenv from 'dotenv';
import proxy from 'express-http-proxy';

dotenv.config();

const gateway = (app) => {
    app.use('/metric-converter', proxy(process.env.SERVICE_03 || 'http://localhost:3003/'));
    app.use('/personal-library', proxy('http://localhost:3004/'));
    app.use('/sudoku-solver', proxy('http://localhost:3005/'));
    app.use('/issue-tracker', proxy('http://localhost:3006/'));
    app.use('/english-translator', proxy('http://localhost:3007/'));
}

export default gateway;