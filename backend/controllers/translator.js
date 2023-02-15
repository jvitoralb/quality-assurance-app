import CustomError from '../errors/custom.js';
import pathFrontend from '../utils/config.js';
import Translator from '../services/translator.js';


export const homeTranslator = (req, res, next) => {
    res.status(200).sendFile(`${pathFrontend}/public/translator.html`);
}

export const getTranslation = (req, res, next) => {
    const refTranslator = new Translator(req.body.locale, req.body.text);
    try {
        res.status(200).json(refTranslator.getTranslation());
    } catch(err) {
        throw new CustomError(err.error, 200);
    }
}