import initFormsEvents, { clearForm } from './trackerForms.js';
import createHTMLElem from '../utils/domElements.js';

const myModal = document.querySelector('#project-issues-modal');
const modalTitle = document.querySelector('#heading-project-issues');
const modalBody = document.querySelector('#project-issues-body');


const upperCaseWord = (word) => word.slice(0, 1).toUpperCase() + word.slice(1);

const createSpinner = () => {
    let div = createHTMLElem['div']('spinner-border text-primary', 'spinner-id');
    div.setAttribute('role', 'status');
    div.appendChild(createHTMLElem['span']('visually-hidden'));
    return div;
}

const projectIssueModal = new bootstrap.Modal(myModal);

export const displayModal = (source, childNodes, action) => {
    modalTitle.textContent = (() => {
        if (action === 'loading') {
            return 'Loading...';
        }
        let [word1, word2] = source.split('-').map(word => upperCaseWord(word));
        return `${word1} ${word2}`;
    })();

    if (action === 'loading') {
        // should add spinner everytime the modal is called because when modal is hidden
        // it deletes every childNode
        modalBody.appendChild(createSpinner());
        projectIssueModal.show();
        return;
    }

    modalBody.removeChild(document.querySelector('#spinner-id'));

    for(let i = 0; i < childNodes.length; i++) {
        modalBody.appendChild(childNodes[i]);
    }
}

const handleAPIAnswer = (source, trackerAnswer) => {
    const convertDate = (date) => new Date(date).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    );
    const customPropName = {
        name: 'Project Name',
        _id: (trackerAnswer.issues ? 'Project ID' : 'Issue ID'),
        project: 'Project ID',
        result: trackerAnswer['result']
        // when delete or put are called the answer = { result: 'success..', ... }
        // this makes so the result prop text is replaced by its value - a string message
    }
    const childNodes = [];

    if (source === 'all-projects-btn') {
        let ul = createHTMLElem['unorderedList']('list-group list-group-flush m-1');

        for(let i = 0; i < trackerAnswer.length; i++) {
            let li = createHTMLElem['listItems'](undefined, 'list-group-item mx-1 px-0');
            for(let prop in trackerAnswer[i]) {
                let updatePropText = upperCaseWord(customPropName[prop] || prop);

                let elem = undefined;
                let div = createHTMLElem['div']();
                div.appendChild(createHTMLElem['paragraph'](updatePropText, 'm-1 fw-semibold'));

                if (prop === 'issues') {
                    elem = createHTMLElem['paragraph'](trackerAnswer[i][prop].length);
                } else {
                    elem = createHTMLElem['paragraph'](trackerAnswer[i][prop]);
                }

                div.appendChild(elem);
                li.appendChild(div);
            }
            ul.appendChild(li);
        }
        childNodes.push(ul);
    } else {
        for(let prop in trackerAnswer) {
            if (trackerAnswer[prop] === '') continue;
            let updatePropText = upperCaseWord(customPropName[prop] || prop);
            let propValueText = (() => {
                // the prop result shouldn't appear in the UI
                if (prop === 'result') return '';

                if (prop === 'created_on' || prop === 'updated_on') {
                    return convertDate(trackerAnswer[prop]);
                }
                return trackerAnswer[prop];
            })();

            let elem = undefined;
            let div = createHTMLElem['div']();
            div.appendChild(createHTMLElem['paragraph'](updatePropText, 'm-1 fw-semibold'));

            if (Array.isArray(trackerAnswer[prop])) {
                elem = createHTMLElem['unorderedList']();
                trackerAnswer[prop].forEach((item) => elem.appendChild(createHTMLElem['listItems'](item._id)));
            } else {
                elem = createHTMLElem['paragraph'](propValueText);
            }

            div.appendChild(elem);
            childNodes.push(div);
        }
    }

    displayModal(source, childNodes, 'show data');
}

const handleAPIError = (source, answer) => {
    let textAnswer = createHTMLElem['paragraph'](upperCaseWord(answer.error));
    displayModal(source, [textAnswer], 'show data');
}

const handleAPICalls = (eventSource, inputData) => {
    const cudTrackerAPICalls = async (dataReq) => {
        const cudCallOptions = {
            'create-issue-form': {
                url: `/issue-tracker/api/v1/issues/${dataReq.project_name}`,
                method: 'POST'
            },
            'update-issue-form': {
                url: `/issue-tracker/api/v1/issues/${dataReq.project_name}`,
                method: 'PUT'
            },
            'delete-issue-form': {
                url: `/issue-tracker/api/v1/issues/${dataReq.project_name}`,
                method: 'DELETE'
            },
            'delete-project-form': {
                url: `/issue-tracker/api/v1/projects/${dataReq.project_name}`,
                method: 'DELETE'
            }
        }
        try {
            const req = await fetch(cudCallOptions[eventSource].url, {
                method: cudCallOptions[eventSource].method,
                mode: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataReq)
            });
            const answer = await req.json();

            if (answer.error || req.status === 400) {
                throw answer;
            }

            handleAPIAnswer(eventSource, answer);
            clearForm(eventSource);
        } catch(err) {
            handleAPIError(eventSource, err);
        }
    }

    const readTrackerAPICalls = async (dataReq = { project_name: '' }) => {
        // The default value for dataReq works when 'all-projects-btn' is called
        // and JS reads dataReq.project_name in readCallOptions['search-issue-form']
        const params = (() => {
            let params = {}
            for(let prop in dataReq) {
                if (prop !== 'project_name') {
                    params[prop] = dataReq[prop];
                }
            }
            return params;
        })();
        const readCallOptions = {
            'search-issue-form': {
                url: `/issue-tracker/api/v1/issues/${dataReq.project_name}?${new URLSearchParams(params)}`
            },
            'all-projects-btn': {
                url: `/issue-tracker/api/v1/projects/`
            }
        }
        try {
            const req = await fetch(readCallOptions[eventSource].url);
            const answer = await req.json();

            if (answer.error || req.status === 400) {
                throw answer;
            }

            if (eventSource === 'search-issue-form' && answer.issues.length === 1) {
                handleAPIAnswer(eventSource, answer.issues[0]);
            } else {
                handleAPIAnswer(eventSource, answer);
            }

            if (eventSource !== 'all-projects-btn') clearForm(eventSource);
        } catch(err) {
            handleAPIError(eventSource, err);
        }
    }

    if (eventSource === 'search-issue-form' || eventSource === 'all-projects-btn') {
        readTrackerAPICalls(inputData);
    } else {
        cudTrackerAPICalls(inputData);
    }
}

window.addEventListener('load', () => {
    initFormsEvents(handleAPICalls);
    myModal.addEventListener('hide.bs.modal', () => {
        while(modalBody.firstChild) {
            modalBody.removeChild(modalBody.firstChild);
        }
    });
});