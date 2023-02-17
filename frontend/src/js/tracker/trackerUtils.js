const createHTMLElem = {
    input: (classAttr = 'form-select') => {
        let input = document.createElement('input');
        input.setAttribute('class', classAttr);
        return input;
    },
    select: (classAttr = 'form-select') => {
        let select = document.createElement('select');
        select.setAttribute('class', classAttr);
        return select;
    },
    option: (value, text) => {
        let option = document.createElement('option');
        option.setAttribute('value', value);
        option.textContent = text;
        return option;
    },
    textarea: (classAttr = 'form-select') => {
        let textarea = document.createElement('textarea');
        textarea.setAttribute('class', classAttr);
        return textarea;
    },
    button: (classAttr = 'btn btn-primary') => {
        let button = document.createElement('button');
        button.setAttribute('class', classAttr);
        return button;
    },
    paragraph: (text, classAttr = 'm-1') => {
        let p = document.createElement('p');
        p.setAttribute('class', classAttr);
        p.textContent = (() => {
            if (typeof text !== 'string') return text;
            if (text.includes('_')) {
                text = text.split('_').map(word => word).join(' ');
            }
            return text;
        })();
        return p;
    },
    unorderedList: (classAttr = 'list-group m-1') => {
        let ul = document.createElement('ul');
        ul.setAttribute('class', classAttr);
        return ul;
    },
    listItems: (itemText, classAttr = 'list-group-item mx-1') => {
        let li = document.createElement('li');
        li.setAttribute('class', classAttr);
        li.textContent = itemText;
        return li;
    },
    div: (classAttr = 'd-flex', customId = undefined) => {
        let div = document.createElement('div');
        div.setAttribute('class', classAttr);
        div.setAttribute('id', customId);
        return div;
    }
}
export default createHTMLElem;