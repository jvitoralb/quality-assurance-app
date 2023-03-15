import handleAPICall from './translatorHandlers.js';

const localeFrom = document.querySelector('#locale-from');
const localeTo = document.querySelector('#locale-to');


const selectChanges = (e) => {
    const localeValues = {
        american: 'british',
        british: 'american'
    }

    if (e.target.id === 'locale-from') {
        localeTo.value = localeValues[localeTo.value];
    }

    if (e.target.id === 'locale-to') {
        localeFrom.value = localeValues[localeFrom.value];
    }
}

const initEvents = () => {
    const toTranslate = document.querySelector('#text-translate');
    const translateBtn = document.querySelector('#translate-btn');

    const submitTranslation = () => {
        const dataTranslation = {
            locale: `${localeFrom.value}-to-${localeTo.value}`,
            text: toTranslate.value
        }

        if (dataTranslation.text !== '') {
            handleAPICall(dataTranslation);
        }
    }

    translateBtn.addEventListener('click', submitTranslation);

    [ localeFrom, localeTo ].forEach((select) => {
        select.addEventListener('change', selectChanges);
    });
}

const start = () => {
    initEvents();
}

window.addEventListener('load', start);