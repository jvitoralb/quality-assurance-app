import { Router } from 'express';
// import fcctesting from '../../../fcctesting.cjs';
import { validateBody, errorHandler } from './middlewares.js';
import { getTranslation } from './controllers.js';


const translator = Router();

translator.post('/api/v1/translate', validateBody, getTranslation);

translator.use(errorHandler);

// fcctesting(translator);

export default translator;