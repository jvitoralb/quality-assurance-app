import { Router } from 'express';
import fcctesting from '../../../fcctesting.cjs';
import queryInput from './middlewares.js';
import { handleConversion, converterHome } from './controllers.js';


const imperialConverter = Router();

imperialConverter.get('/', converterHome);
imperialConverter.get('/api/v1/convert', queryInput, handleConversion);

fcctesting(imperialConverter);

export default imperialConverter;