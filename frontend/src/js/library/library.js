import createHTMLElem from '../utils/domElements.js';
import initFormsListeners from './libraryForms.js';
import handleAPICalls from './libraryApi.js';

export const bookContainer = document.querySelector('#books-container');
export const commentsList = document.querySelector('#book-modal-comments');
export const bookInfoModalElem = document.querySelector('#book-info-modal');
export const addBookModalElem = document.querySelector('#add-book-modal');
export const bookInfoModal = new bootstrap.Modal(bookInfoModalElem);
export const addBookModal = new bootstrap.Modal(addBookModalElem);


export const displayBookInfo = ({ bookTitle, bookAuthor,  commentNodes }) => {
    commentsList.removeChild(document.querySelector('#spinner-container-book-info'));

    document.querySelector('#title-book-info').textContent = bookTitle;
    document.querySelector('#author-book-info').textContent = bookAuthor ? `Author: ${bookAuthor}` : '';

    for(let i = 0; i < commentNodes.length; i++) {
        commentsList.appendChild(commentNodes[i]);
    }
}


export const createCommentElement = ({ _id, created_by, created_on, text }) => {
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

export const createBookElement = (bookObj) => {
    let bookElem = createHTMLElem['anchor']('p-2 col-lg-3 col-md-4 col-sm-6 border', bookObj._id);
    let commentsCount = bookObj.commentcount > 0 ? `Comments: ${bookObj.commentcount}` : '+ Add Comment';
    bookElem.innerHTML = `${bookObj.title}<br/>Author: ${bookObj.author}<br/>${commentsCount}`;
    bookElem.addEventListener('click', (e) => {
        e.preventDefault();
        bookInfoModal.show();
        handleAPICalls('get-book-info', { bookID: e.target.getAttribute('href') });
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

const populateBooksSection = () => {
    handleAPICalls('get-all-books', {});
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