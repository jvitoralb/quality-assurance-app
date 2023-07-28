import { Router } from 'express';
// import fcctesting from '../../../fcctesting.cjs';
import { queryInput, errorHandler} from './middlewares.js';
import { handleConversion } from './controllers.js';


const imperialConverter = Router();

imperialConverter.get('/api/v1/convert', queryInput, handleConversion);
imperialConverter.use(errorHandler);

// fcctesting(imperialConverter);

export default imperialConverter;