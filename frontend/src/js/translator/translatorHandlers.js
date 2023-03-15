import createHTMLElem from '../utils/domElements.js';

const translation = document.querySelector('#text-translation');


const handleError = (error) => {
    const alertContainer = document.querySelector('#alert-container');

    const alertElem = createHTMLElem['div']('alert alert-warning alert-dismissible py-2 px-3');
    alertElem.appendChild(createHTMLElem['paragraph']('Something went wrong. Please try again later!'));

    const alert = new bootstrap.Alert(alertElem);
    alertContainer.appendChild(alertElem);

    setTimeout(() => alert.close(), 2000);
}

const handleAnswer = (dataAnswer) => {
    if (dataAnswer.translation === 'Everything looks good to me!') {
        translation.value = dataAnswer.text;
        return;
    }

    let translationResult = dataAnswer.translation;

    const regexp = /<span class="highlight">(?<word>\w*\S*\w+\s*\w+[.]*|\w*\s*\w+\s*\w+[.]*)<\/span>/g;

    for(const match of translationResult.matchAll(regexp)) {
        translationResult = translationResult.replace(match[0], match.groups.word);
    }

    translation.value = translationResult;
}

const clearTranslation = () => {
    if (translation.value !== '') {
        translation.value = '';
    }
}

export const handleAPICall = (dataTranslation) => {
    const translate = async (dataReq) => {
        try {
            const req = await fetch('/english-translator/api/v1/translate', {
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataReq)
            });
            const answer = await req.json();

            if (answer.hasOwnProperty('error')) {
                throw answer;
            }

            handleAnswer(answer);
        } catch(err) {
            handleError(err);
        }
    }
    clearTranslation();
    translate(dataTranslation);
}

export default handleAPICall;