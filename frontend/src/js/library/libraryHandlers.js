import createHTMLElem from '../utils/domElements.js';
import { clearInputs } from './libraryForms.js';
import {
    bookContainer, commentsList, addBookModal, addBookModalElem,
    createCommentElement, createBookElement, displayBookInfo, bookInfoModalElem
} from './library.js';


export const errorHandler = (dataError, source) => {
    const allBooksError = (errorAnswer) => {
        let text = createHTMLElem['paragraph'](errorAnswer.error, 'm-1 text-center');
        text.setAttribute('id', 'no-books-text');
        bookContainer.removeChild(document.querySelector('#spinner-container-all-books'));
        bookContainer.appendChild(text);
    }
    const bookInfoError = (errorAnswer) => {
        displayBookInfo({
            bookTitle: errorAnswer.error,
            bookAuthor: '',
            commentNodes: []
        });
    }
    const addBookError = (errorAnswer) => {
        const errorMessageBook = document.querySelector('#add-book-error-message');

        const dismissMessageBook = () => errorMessageBook.textContent = '';

        errorMessageBook.textContent = errorAnswer.error.slice(0, 1).toUpperCase() + errorAnswer.error.slice(1) + '!';
        addBookModalElem.addEventListener('click', dismissMessageBook);
    }
    const addCommentError = (errorAnswer) => {
        const errorMessageComment = document.querySelector('#book-info-error-message');
    
        const dismissMessageComment = () => errorMessageComment.textContent = '';

        errorMessageComment.textContent = errorAnswer.error.slice(0, 1).toUpperCase() + errorAnswer.error.slice(1) + '!';
        bookInfoModalElem.addEventListener('click', dismissMessageComment);
    }

    const errorsCallback = {
        'get-all-books': allBooksError,
        'get-book-info': bookInfoError,
        'add-book-form': addBookError,
        'add-comment-form': addCommentError
    }
    errorsCallback[source](dataError);
}

export const answerHandler = (dataAnswer, source) => {
    const addBookAnswer = (answer) => {
        if (document.querySelector('#no-books-text')) {
            bookContainer.removeChild(document.querySelector('#no-books-text'));
        }

        let elem = createBookElement(answer);
        bookContainer.insertBefore(elem, bookContainer.firstChild);
        addBookModal.hide();
    }
    const addCommentAnswer = (answer) => {
        const anchors = document.querySelectorAll('a');
        for(let i = 0; i < anchors.length; i++) {
            if (anchors[i].getAttribute('href') === answer[0]._id) {
                anchors[i].innerHTML = `${answer[0].title}<br/>Author: ${answer[0].author}<br/>Comments: ${answer[0].commentcount}`;
                break;
            }
        }
    
        const latestComment = answer[0].comments[answer[0].comments.length - 1];
        let newComment = createCommentElement(latestComment);
    
        const listLine = commentsList.firstChild;
        commentsList.insertBefore(newComment, listLine.nextSibling);
    }
    const allBooksAnswer = (answer) => {
        if (document.querySelector('#spinner-container-all-books')) {
            bookContainer.removeChild(document.querySelector('#spinner-container-all-books'));
        }

        answer.forEach((book) => {
            let elem = createBookElement(book);
            bookContainer.appendChild(elem);
        });
    }
    const bookInfoAnswer = (answer) => {
        const book = answer[0];
        const commentSecNodes = [];

        document.querySelector('#add-comment-form').setAttribute('action', book._id);
    
        let listLine = createHTMLElem['listItems']('', 'list-group-item mx-1 p-0', 'comment-first-li');
        commentSecNodes.push(listLine);
    
        book.comments.sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime())
        .forEach((com) => {
            let listElem = createCommentElement(com);
            commentSecNodes.push(listElem);
        });

        displayBookInfo({
            bookTitle: book.title,
            bookAuthor: book.author,
            commentNodes: commentSecNodes
        });
    }

    const answerCallback = {
        'get-all-books': allBooksAnswer,
        'get-book-info': bookInfoAnswer,
        'add-book-form': addBookAnswer,
        'add-comment-form': addCommentAnswer
    }
    answerCallback[source](dataAnswer);
}

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