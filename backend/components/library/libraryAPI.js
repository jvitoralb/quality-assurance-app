import { Router } from 'express';
import fcctesting from '../../routes/fcctesting.cjs';
import { libraryHandler, libraryHome } from './libraryController.js';
import { checkTitle, checkText, checkOnBooks } from './libraryMiddleware.js';


const personalLibrary = Router();

personalLibrary.route('/')
.get(libraryHome);

personalLibrary.route('/api/v1/books')
.get(libraryHandler) // Gets all books
.post(checkTitle, libraryHandler) // Posts a book
.delete(libraryHandler); // Deletes all books

personalLibrary.route('/api/v1/books/:_id')
.all(checkOnBooks)
.get(libraryHandler) // Gets a specific book
.post(checkText, libraryHandler) // Posts a comment to a book
.delete(libraryHandler); // Deletes a book and its comments

fcctesting(personalLibrary);

export default personalLibrary;