const addBookForm = document.querySelector('#add-book-form');
const addCommentForm = document.querySelector('#add-comment-form');

const forms = [
    addBookForm,
    addCommentForm
];

/**
 *  Manage Inputs
**/
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

/**
 * Start()
**/
const initFormsListeners = (apiCallsHandler) => {
    const submitHandler = (e) => {
        e.preventDefault();

        apiCallsHandler(e.target.getAttribute('id'), {
            formData: getData(e.target),
            bookID: e.target.getAttribute('action')
        });
    }

    forms.forEach((form) => {
        form.addEventListener('submit', submitHandler);
    });
}

export default initFormsListeners;