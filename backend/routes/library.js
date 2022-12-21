import { Router } from 'express'
import fcctesting from './fcctesting.cjs'
import libraryHandler from '../controllers/library.js'
import { checkTitle, checkText, checkOnBooks } from '../middleware/library.js'


const personalLibrary = Router();

personalLibrary.get('/', (req, res) => {
    res.send('Personal Library Home!')
})

personalLibrary.route('/api/books')
.get(libraryHandler) // Gets all books
.post(checkTitle, libraryHandler) // Posts a book
.delete(libraryHandler) // Deletes all books

personalLibrary.route('/api/books/:_id')
.all(checkOnBooks)
.get(libraryHandler) // Gets a specific book
.post(checkText, libraryHandler) // Posts a comment to a book
.delete(libraryHandler) // Deletes a book and its comments

fcctesting(personalLibrary);

export default personalLibrary;