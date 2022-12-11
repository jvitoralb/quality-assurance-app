import { Router } from 'express'
import fcctesting from './fcctesting.cjs'
import { libraryHandleGet, libraryHandlePost, libraryHandleDelete } from '../controllers/library.js'


const personalLibrary = Router();

personalLibrary.get('/', (req, res) => {
    res.send('Personal Library Home!')
})


personalLibrary.get('/api/books', (req, res, next) => {
    // Gets all books
    libraryHandleGet(req, res, next)
})
personalLibrary.get('/api/books/:_id', (req, res, next) => {
    // Gets a specific book
    console.log('get')
    libraryHandleGet(req, res, next)
})


personalLibrary.post('/api/books', (req, res, next) => {
    // Posts a book
    libraryHandlePost(req, res, next)
})
personalLibrary.post('/api/books/:_id', (req, res, next) => {
    // Posts a comment to a book
    libraryHandlePost(req, res, next)
})


personalLibrary.delete('/api/books', (req, res, next) => {
    // Deletes all books
    libraryHandleDelete(req, res, next)
})
personalLibrary.delete('/api/books/:_id', (req, res, next) => {
    // Deletes a book and its comments
    libraryHandleDelete(req, res, next)
})

fcctesting(personalLibrary);

export default personalLibrary;