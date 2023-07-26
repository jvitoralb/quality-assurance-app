import { Router } from 'express';
import fcctesting from '../../fcctesting.cjs';
import { validateBody } from './translatorMiddleware.js';
import { homeTranslator, getTranslation } from './translatorController.js';


const translator = Router();

translator.get('/', homeTranslator);
translator.post('/api/v1/translate', validateBody, getTranslation);

fcctesting(translator);

export default translator;