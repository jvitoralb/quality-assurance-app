import { Router } from 'express';
// import fcctesting from '../../../fcctesting.cjs';
import { libraryHandler } from './controllers.js';
import { checkTitle, checkText, checkOnBooks, errorHandler } from './middlewares.js';


const personalLibrary = Router();

personalLibrary.route('/api/v1/books')
.get(libraryHandler) // Gets all books
.post(checkTitle, libraryHandler) // Posts a book
.delete(libraryHandler); // Deletes all books

personalLibrary.route('/api/v1/books/:_id')
.all(checkOnBooks)
.get(libraryHandler) // Gets a specific book
.post(checkText, libraryHandler) // Posts a comment to a book
.delete(libraryHandler); // Deletes a book and its comments

personalLibrary.use(errorHandler);

// fcctesting(personalLibrary);

export default personalLibrary;