import pathFrontend from '../utils/config.js'
import { handleGet, handlePost, handleDelete } from '../services/library.js'


export const libraryHome = (req, res, next) => {
    res.status(200).sendFile(`${pathFrontend}/public/library.html`)
}

export const libraryHandler = async (req, res, next) => {
    const bookStats = {
        _id: req.params._id,
        title: req.body.title
    }
    const commentStats = {
        _id: req.params._id,
        text: req.body.text,
        comment: req.query.comment
    }
    const services = {
        GET: () => handleGet(bookStats), 
        POST: () => handlePost(bookStats, commentStats), 
        DELETE: () => handleDelete(bookStats, commentStats),
    }

    const sendResponse = (answer, statusCode = 200) => {
        res.status(statusCode).json(answer)
    }

    try {
        if (services[req.method]) {
            let answer = await services[req.method]()
            let statusCode = req.method === 'POST' ? 201 : 200
            sendResponse(answer, statusCode)
        } else {
            next()
        }
    } catch(err) {
        next(err)
    }
}