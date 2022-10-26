import { Router } from 'express'
import ConvertHandler from '../controllers/convertHandler.js';


const imperialConverter = Router();

imperialConverter.get('/', (req, res) => {
    res.status(200).json({
        page: 'Metric-Imperial Converter'
    })
})

imperialConverter.get('/api/convert', (req, res) => {
    const { input } = req.body
    let handler = new ConvertHandler()

    res.status(201).json({
        convert: input, // full ex 10kg
        unit: handler.getUnit(), // ex kg
        value: handler.getValue(), // ex 10
        converted: handler.convert(), // full ex xlbs
        reqUnit: handler.getUnit(), // ex lbs
        reqValue: handler.getValue() // ex x
    })
})

export default imperialConverter