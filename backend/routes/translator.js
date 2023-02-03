import { Router } from 'express';
import fcctesting from './fcctesting.cjs';
import { validateBody } from '../middleware/translator.js';
import { homeTranslator, getTranslation } from '../controllers/translator.js';


const translator = Router();

translator.get('/', homeTranslator);
translator.post('/api/v1/translate', validateBody, getTranslation);

translator.post('/api/translate', validateBody, getTranslation);

fcctesting(translator);

export default translator;