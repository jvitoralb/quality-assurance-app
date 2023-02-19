import { displayModal } from './tracker.js';
import createHTMLElem from './trackerUtils.js';

const createIssue = document.querySelector('#create-issue-form');
const searchIssue = document.querySelector('#search-issue-form');
const updateIssue = document.querySelector('#update-issue-form');
const deleteIssue = document.querySelector('#delete-issue-form');
const allProjectsBtn = document.querySelector('#all-projects-btn');
const deleteProject = document.querySelector('#delete-project-form');
const updateFormSelect = document.querySelector('#update-add-field');
const searchFormSelect = document.querySelector('#search-add-field');


export const allForms = [
    createIssue,
    searchIssue,
    updateIssue,
    deleteIssue,
    deleteProject
];

const handleNewInputs = (target, targetValue) => {
    const targetSelect = target;
    const [ targetBtn, targetForm ] = ((id) => {
        const targetBtnForm = {
            'search-add-field': () => [ document.querySelector('#search-issue-btn'), searchIssue ],
            'update-add-field': () => [ document.querySelector('#update-issue-btn'), updateIssue ]
        }
        return targetBtnForm[id]();
    })(target.id);
    const createInput = (() => {
        let formElement = undefined;
        let attrList = [];
        if (targetValue === 'open') {
            formElement = createHTMLElem['select']();
            attrList = [
                ['id', targetValue],
                ['name', targetValue],
                ['aria-label', 'Select Issue Status'],
                ['required', '']
            ];
            [ 'Open', 'True', 'False' ].forEach(val => {
                let option = undefined;
                if (val === 'Open') {
                    option = createHTMLElem['option']('', val);
                    option.setAttribute('required', '');
                } else {
                    option = createHTMLElem['option'](val.toLocaleLowerCase(), val);
                }
                formElement.appendChild(option);
            });
        } else if (targetValue === 'issue-text') {
            formElement = createHTMLElem['textarea']();
            attrList = [
                ['id', targetValue],
                ['name', targetValue],
                ['placeholder', targetValue.replace('-', ' ')],
                ['required', '']
            ];
        } else {
            formElement = createHTMLElem['input']();
            attrList = [
                ['id', targetValue],
                ['name', targetValue],
                ['type', 'text'],
                ['placeholder', targetValue.replace('-', ' ')],
                ['required', '']
            ];
        }
        attrList.forEach((pair) => formElement.setAttribute(pair[0], pair[1]));
        return formElement;
    })();
    const createContainer = (() => {
        return createHTMLElem['div']('d-flex align-items-center', `${target.parentNode.id}-container-${targetValue}`);
    })();

    createContainer.appendChild(createInput);

    const createCloseBtn = (() => {
        let closeBtn = createHTMLElem['button']('btn-close mx-1');
        closeBtn.setAttribute('id', `${targetValue}-container-close-btn`)
        closeBtn.addEventListener('click', () => {
            let con = targetForm.removeChild(createContainer);
            let optionName = con.childNodes[0].name.replace('-', ' ').split(' ')
            .map(item => item = item.slice(0, 1).toUpperCase() + item.slice(1)).join(' ');
            targetSelect.options[targetSelect.options.length] = new Option(optionName, con.childNodes[0].name)
        });
        return closeBtn;
    })();

    createContainer.append(createCloseBtn);
    targetForm.appendChild(createContainer);

    const organizeForm = (() => {
        targetSelect.remove(targetSelect.selectedIndex);
        targetForm.removeChild(targetSelect);
        targetForm.removeChild(targetBtn);
        targetForm.appendChild(targetSelect);
        targetForm.appendChild(targetBtn);
    })();
}

const getFormData = (target) => {
    const formInputData = {};
    for(const pair of new FormData(target).entries()) {
        formInputData[pair[0].replace('-', '_')] = pair[1];
    }
    return formInputData;
}

export const clearForm = (targetID) => {
    let form = undefined;
    for(let i = 0; i < allForms.length; i++) {
        if (allForms[i].id === targetID) {
            form = allForms[i];
            break;
        }
    }
    for(let j = 0; j < form.childNodes.length; j++) {
        if (form.childNodes[j].value) {
            form.childNodes[j].value = '';
        }
        if (form.childNodes[j].tagName === 'DIV') {
            //if the form has some input added within a container
            form.childNodes[j].childNodes[0].value = '';
        }
    }
}

const initFormsEvents = (apiCallBack) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        displayModal(null, null, 'loading');
        apiCallBack(e.target.id, getFormData(e.target));
    }

    allForms.forEach(form => {
        form.addEventListener('submit', handleSubmit);
        form.addEventListener('hidden.bs.collapse', (e) => clearForm(e.target.id));
    });

    allProjectsBtn.addEventListener('click', (e) => {
        // Since the 'See All projects' section lacks a form this triggers its API call
        displayModal(null, null, 'loading');
        apiCallBack(e.target.id);
    });

    [ updateFormSelect, searchFormSelect ].forEach(select => {
        select.addEventListener('change', (e) => handleNewInputs(e.target, e.target.value));
    });
}

export default initFormsEvents;