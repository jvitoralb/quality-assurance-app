import { Router } from 'express';
import fcctesting from './fcctesting.cjs';
import queryInput from '../middleware/converter.js';
import { handleConversion, converterHome } from '../controllers/converter.js';


const imperialConverter = Router();

imperialConverter.get('/', converterHome);
imperialConverter.get('/api/v1/convert', queryInput, handleConversion);

fcctesting(imperialConverter);

export default imperialConverter;