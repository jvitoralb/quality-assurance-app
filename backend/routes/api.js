import { Router } from 'express'
import ConvertHandler, { convertInput } from '../controllers/convertHandler.js';


const imperialConverter = Router();

imperialConverter.get('/', (req, res) => {
    res.status(200).json({
        page: 'Metric-Imperial Converter'
    })
})

imperialConverter.get('/api/convert', (req, res) => {
    convertInput(req, res)
})

export default imperialConverter