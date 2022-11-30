import { Router } from 'express'
import { join } from 'path'
import pathFrontEnd from '../config.js'
import fcctesting from './fcctesting.cjs'
import queryInput from '../middleware/converter.js'
import { handleInput } from '../controllers/converter.js'


const imperialConverter = Router();

imperialConverter.get('/', (req, res) => {
    res.status(200)
    .sendFile(
        join(pathFrontEnd, '/public/converter.html')
    )
})

imperialConverter.get('/api/convert', queryInput, handleInput)

fcctesting(imperialConverter)

export default imperialConverter