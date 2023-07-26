import CustomError from '../../../errors/custom.js';
import pathFrontend from '../../../configs/pathConfig.js';
import Translator from '../service/services.js';


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