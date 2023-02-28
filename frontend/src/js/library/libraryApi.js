import { clearInputs } from './libraryForms.js';


const handleAPICalls = (eventSource, data, callback) => {
    const readAllBooks = async () => {
        const handleError = (answer) => {
            let text = createHTMLElem['paragraph'](answer.error, 'm-1 text-center');
            text.setAttribute('id', 'no-books-text');
            bookContainer.removeChild(document.querySelector('#spinner-container-all-books'));
            bookContainer.appendChild(text);
        }
        try {
            const reqBooks = await fetch('/personal-library/api/v1/books');
            const answer = await reqBooks.json();

            if (reqBooks.status === 500) {
                throw { error: 'Something went wrong. Please try again later!' }
            }

            if (!answer.length) {
                throw { error: 'No Books found!' }
            }

            callback(answer);
        } catch(err) {
            handleError(err);
        }
    }

    const readBook = async ({ bookID }) => {
        const handleBookError = (errorAnswer) => {
            displayBookInfo({
                bookTitle: errorAnswer.error,
                bookAuthor: '',
                commentNodes: []
            });
        }
        try {
            const reqBook = await fetch(`/personal-library/api/v1/books/${bookID}`);
            const answer = await reqBook.json();

            if (reqBook.status === 400) {
                throw answer;
            }

            callback(answer);
        } catch(err) {
            handleBookError(err);
        }
    }

    const createBookComment = async ({ formData, bookID }) => {
        const handleCreateError = (answer, source) => {
            const errorMessageBook = document.querySelector('#add-book-error-message');
            const errorMessageComment = document.querySelector('#book-info-error-message');

            if (source === 'add-book-form') {
                const dismissMessageBook = () => errorMessageBook.textContent = '';

                errorMessageBook.textContent = answer.error.slice(0, 1).toUpperCase() + answer.error.slice(1) + '!';
                addBookModalElem.addEventListener('click', dismissMessageBook);
            } else {
                const dismissMessageComment = () => errorMessageComment.textContent = '';

                errorMessageComment.textContent = answer.error.slice(0, 1).toUpperCase() + answer.error.slice(1) + '!';
                bookInfoModalElem.addEventListener('click', dismissMessageComment);
            }
        }

        const apis = {
            'add-book-form': '/personal-library/api/v1/books',
            'add-comment-form': `/personal-library/api/v1/books/${bookID}`
        }

        try {
            const reqPost = await fetch(apis[eventSource], {
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const answer = await reqPost.json();

            if (reqPost.status === 400) {
                throw answer;
            }

            clearInputs(eventSource);
            callback(answer);
        } catch(err) {
            handleCreateError(err, eventSource);
        }
    }

    const deleteBooks = async () => {
        try {
            const reqDeletion = await fetch('/personal-library/api/v1/books', {
                method: 'DELETE',
                mode: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const answer = await reqDeletion.json();

            if (reqDeletion.status === 400) {
                throw answer;
            }

            console.log(answer);
        } catch(err) {
            console.log(err);
        }
    }

    const actionsCalls = {
        'get-all-books': readAllBooks,
        'get-book-info': readBook,
        'add-book-form': createBookComment,
        'add-comment-form': createBookComment,
        'delete-books': deleteBooks,
    }
    actionsCalls[eventSource](data);
}

export default handleAPICalls;