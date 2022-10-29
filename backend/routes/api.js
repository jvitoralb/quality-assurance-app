import { Router } from 'express'
import fcctesting from './fcctesting.cjs'
import { convertInput } from '../controllers/convertHandler.js'


const imperialConverter = Router();

imperialConverter.get('/', (req, res) => {
    res.status(200).json({
        page: 'Metric-Imperial Converter'
    })
})

imperialConverter.get('/api/convert', (req, res) => {
    convertInput(req, res)
})

fcctesting(imperialConverter)

export default imperialConverter