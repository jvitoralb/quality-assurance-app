import { Router } from 'express';
import fcctesting from '../../routes/fcctesting.cjs';
import queryInput from './converterMiddleware.js';
import { handleConversion, converterHome } from './converterController.js';


const imperialConverter = Router();

imperialConverter.get('/', converterHome);
imperialConverter.get('/api/v1/convert', queryInput, handleConversion);

fcctesting(imperialConverter);

export default imperialConverter;