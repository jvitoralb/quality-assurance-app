import { Router } from 'express'
import { join } from 'path'
import pathFrontEnd from '../config.js'
import fcctesting from './fcctesting.cjs'
import { convertInput } from '../controllers/convertHandler.js'


const imperialConverter = Router();

imperialConverter.get('/', (req, res) => {
    res.status(200).sendFile(join(pathFrontEnd, '/public/converter.html'))
})

imperialConverter.get('/api/convert', (req, res) => {
    convertInput(req, res)
})

fcctesting(imperialConverter)

export default imperialConverter