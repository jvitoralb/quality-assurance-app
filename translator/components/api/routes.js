import { Router } from 'express';
// import fcctesting from '../../../fcctesting.cjs';
import { validateBody } from './middlewares.js';
import { translatorHome, getTranslation } from './controllers.js';


const translator = Router();

translator.get('/', translatorHome);

translator.post('/api/v1/translate', validateBody, getTranslation);

// fcctesting(translator);

export default translator;