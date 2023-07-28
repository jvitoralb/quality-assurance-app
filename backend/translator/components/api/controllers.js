import CustomError from '../../errors/custom.js';
import Translator from '../service/services.js';


export const getTranslation = (req, res, next) => {
    const refTranslator = new Translator(req.body.locale, req.body.text);
    try {
        res.status(200).json(refTranslator.getTranslation());
    } catch(err) {
        throw new CustomError(err.error, 200);
    }
}