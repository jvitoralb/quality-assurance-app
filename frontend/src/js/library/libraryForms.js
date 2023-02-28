import { addBookAnswer, addCommentAnswer } from './library.js';

const addBookForm = document.querySelector('#add-book-form');
const addCommentForm = document.querySelector('#add-comment-form');

const forms = [
    addBookForm,
    addCommentForm
];

export const clearInputs = (targetID) => {
    let form = undefined;
    for(let i = 0; i < forms.length; i++) {
        if (forms[i].id === targetID) {
            form = forms[i];
            break;
        }
    }
    for(let j = 0; j < form.childNodes.length; j++) {
        if (form.childNodes[j].value) {
            form.childNodes[j].value = '';
        }
    }
}

const getData = (targetForm) => {
    const formInputData = {};
    for(const pair of new FormData(targetForm).entries()) {
        if (pair[1] !== '') {
            formInputData[pair[0]] = pair[1];
        }
    }
    return formInputData;
}

const initFormsListeners = (apiCallsHandler) => {
    const submitHandler = (e) => {
        e.preventDefault();

        const targetForm = e.target.getAttribute('id');
        const submitCallbacks = {
            'add-book-form': addBookAnswer, 
            'add-comment-form': addCommentAnswer
        }

        apiCallsHandler(targetForm, {
            formData: getData(e.target),
            bookID: e.target.getAttribute('action')
        }, submitCallbacks[targetForm]);
    }

    forms.forEach((form) => {
        form.addEventListener('submit', submitHandler);
    });
}

export default initFormsListeners;