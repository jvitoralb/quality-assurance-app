import { clearInputs } from './libraryForms.js';
import { answerHandler, errorHandler } from './library.js';


const handleAPICalls = (eventSource, data) => {
    const readAllBooks = async () => {
        try {
            const reqBooks = await fetch('/personal-library/api/v1/books');
            const answer = await reqBooks.json();

            if (reqBooks.status === 500) {
                throw { error: 'Something went wrong. Please try again later!' }
            }

            if (!answer.length) {
                throw { error: 'No Books found!' }
            }
            answerHandler(answer, eventSource);
        } catch(err) {
            errorHandler(err, eventSource);
        }
    }

    const readBook = async ({ bookID }) => {
        try {
            const reqBook = await fetch(`/personal-library/api/v1/books/${bookID}`);
            const answer = await reqBook.json();

            if (reqBook.status === 400) {
                throw answer;
            }
            answerHandler(answer, eventSource);
        } catch(err) {
            errorHandler(err, eventSource);
        }
    }

    const createBookComment = async ({ formData, bookID }) => {
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
            answerHandler(answer, eventSource);
        } catch(err) {
            errorHandler(err, eventSource);
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