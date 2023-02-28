import createHTMLElem from '../utils/domElements.js';
import initFormsListeners from './libraryForms.js';
import handleAPICalls from './libraryApi.js';

const bookContainer = document.querySelector('#books-container');
const commentsList = document.querySelector('#book-modal-comments');
const bookInfoModalElem = document.querySelector('#book-info-modal');
const addBookModalElem = document.querySelector('#add-book-modal');
const bookInfoModal = new bootstrap.Modal(bookInfoModalElem);
const addBookModal = new bootstrap.Modal(addBookModalElem);


const displayBookInfo = ({ bookTitle, bookAuthor,  commentNodes }) => {
    commentsList.removeChild(document.querySelector('#spinner-container-book-info'));

    document.querySelector('#title-book-info').textContent = bookTitle;
    document.querySelector('#author-book-info').textContent = bookAuthor ? `Author: ${bookAuthor}` : '';

    for(let i = 0; i < commentNodes.length; i++) {
        commentsList.appendChild(commentNodes[i]);
    }
}

/**
 *  Creating Elements/Sections
**/
const createCommentElement = ({ _id, created_by, created_on, text }) => {
    let li = createHTMLElem['listItems']('', 'list-group-item d-flex', _id);

    li.appendChild(createHTMLElem['image']('img-thumbnail', '../../../public/images/ursinho-pooh.png', 'pooh-profile-picture', 64));

    let container = createHTMLElem['div']('px-2 row');

    let infoContainer = createHTMLElem['div']('d-flex justify-content-between');
    infoContainer.appendChild(createHTMLElem['paragraph'](created_by, 'mb-1 fw-semibold'));
    infoContainer.appendChild(createHTMLElem['paragraph'](
        new Date(created_on).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        'mb-1'
    ));

    container.appendChild(infoContainer);
    container.appendChild(createHTMLElem['paragraph'](text, 'mb-1'));

    li.appendChild(container);
    return li;
}

const createBookElement = (bookObj) => {
    let bookElem = createHTMLElem['anchor']('p-2 col-lg-3 col-md-4 col-sm-6 border', bookObj._id);
    let commentsCount = bookObj.commentcount > 0 ? `Comments: ${bookObj.commentcount}` : '+ Add Comment';
    bookElem.innerHTML = `${bookObj.title}<br/>Author: ${bookObj.author}<br/>${commentsCount}`;
    bookElem.addEventListener('click', (e) => {
        e.preventDefault();
        bookInfoModal.show();
        handleAPICalls('get-book-info', { bookID: e.target.getAttribute('href') }, populateCommentSection);
    });
    return bookElem;
}

const createSpinner = () => {
    let container = createHTMLElem['div']('col text-center', 'spinner-container-book-info');
    let div = createHTMLElem['div']('spinner-border text-primary', 'spinner-id');
    div.setAttribute('role', 'status');
    div.appendChild(createHTMLElem['span']('visually-hidden'));
    return container;
}

/**
 * APIs Callbacks
**/
export const addBookAnswer = (answer) => {
    if (bookContainer.firstChild.id === 'no-books-text') {
        bookContainer.removeChild(bookContainer.firstChild);
    }
    let elem = createBookElement(answer);
    bookContainer.insertBefore(elem, bookContainer.firstChild);
    addBookModal.hide();
}

export const addCommentAnswer = (answer) => {
    const updateBookElement = (() => {
        const anchors = document.querySelectorAll('a');

        for(let i = 0; i < anchors.length; i++) {
            if (anchors[i].getAttribute('href') === answer[0]._id) {
                anchors[i].innerHTML = `${answer[0].title}<br/>Author: ${answer[0].author}<br/>Comments: ${answer[0].commentcount}`;
                break;
            }
        }
    })();

    const latestComment = answer[0].comments[answer[0].comments.length - 1];
    let newComment = createCommentElement(latestComment);

    const listLine = commentsList.firstChild;
    commentsList.insertBefore(newComment, listLine.nextSibling);
}

const allBooksAnswer = (answer) => {
    bookContainer.removeChild(document.querySelector('#spinner-container-all-books'));

    answer.forEach((book) => {
        let elem = createBookElement(book);
        bookContainer.appendChild(elem);
    });
}

const populateCommentSection = ([ book ]) => {
    document.querySelector('#add-comment-form').setAttribute('action', book._id);
    const commentSecNodes = [];

    let listLine = createHTMLElem['listItems']('', 'list-group-item mx-1 p-0', 'comment-first-li');
    commentSecNodes.push(listLine);

    book.comments.sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime());

    book.comments.forEach((com) => {
        let listElem = createCommentElement(com);
        commentSecNodes.push(listElem);
    });

    displayBookInfo({
        bookTitle: book.title,
        bookAuthor: book.author,
        commentNodes: commentSecNodes
    });
}

/**
 * Start()
**/
const populateBooksSection = () => {
    handleAPICalls('get-all-books', {}, allBooksAnswer);
}

const initListeners = () => {
    bookInfoModalElem.addEventListener('hide.bs.modal', () => {
        while(commentsList.firstChild) {
            commentsList.removeChild(commentsList.firstChild);
        }
        commentsList.appendChild(createSpinner());
    });
}

window.addEventListener('load', () => {
    initListeners();
    initFormsListeners(handleAPICalls);
    populateBooksSection();
});