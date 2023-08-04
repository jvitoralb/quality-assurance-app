import { Router } from 'express';
// import fcctesting from '../../../fcctesting.cjs';
import { libraryHome, libraryHandler } from './controllers.js';
import { checkTitle, checkText, checkOnBooks } from './middlewares.js';


const personalLibrary = Router();

personalLibrary.route('/')
.get(libraryHome);

personalLibrary.route('/api/v1/books')
.get(libraryHandler)
.post(checkTitle, libraryHandler)
.delete(libraryHandler);

personalLibrary.route('/api/v1/books/:_id')
.all(checkOnBooks)
.get(libraryHandler)
.post(checkText, libraryHandler)
.delete(libraryHandler);

// fcctesting(personalLibrary);

export default personalLibrary;