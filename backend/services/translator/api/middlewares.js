import CustomError from '../../../errors/custom.js';


export const validateBody = (req, res, next) => {
    const { body } = req;

    if (!body.locale || body.text === undefined) {
        throw new CustomError('Required field(s) missing', 400);
    }

    if (body.text === '') {
        throw new CustomError('No text to translate', 200);
    }

    if (!body.locale.match(/\w+-to-\w+/)) {
        throw new CustomError('Invalid value for locale field', 400);
    }

    next();
}