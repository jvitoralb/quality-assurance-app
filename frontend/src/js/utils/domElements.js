const createHTMLElem = {
    input: (classAttr = 'form-select', customType = 'text', customId = 'input-id') => {
        let input = document.createElement('input');
        input.setAttribute('class', classAttr);
        input.setAttribute('type', customType);
        input.setAttribute('id', customId);
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
    listItems: (itemText, classAttr = 'list-group-item mx-1', customId) => {
        let li = document.createElement('li');
        customId && li.setAttribute('id', customId);
        li.setAttribute('class', classAttr);
        li.textContent = itemText;
        return li;
    },
    div: (classAttr = 'd-flex', customId = 'div-container') => {
        let div = document.createElement('div');
        div.setAttribute('class', classAttr);
        div.setAttribute('id', customId);
        return div;
    },
    span: (classAttr = 'd-flex', text) => {
        let span = document.createElement('span');
        span.setAttribute('class', classAttr);
        span.textContent = text;
        return span;
    },
    anchor: (classAttr = 'p-2', href) => {
        let a = document.createElement('a');
        a.setAttribute('class', classAttr);
        a.setAttribute('href', href);
        return a;
    },
    image: (classAttr, source, alt, width, height) => {
        let img = document.createElement('img');
        img.setAttribute('class', classAttr);
        img.setAttribute('src', source);
        img.setAttribute('alt', alt);
        width && img.setAttribute('width', width);
        height && img.setAttribute('height', height);
        return img;
    },
    trow: () => {
        let tr = document.createElement('tr');
        return tr;
    },
    tcell: (style) => {
        let td = document.createElement('td');
        style && td.setAttribute('style', style);
        return td;
    },
    tbody: () => {
        let tbody = document.createElement('tbody');
        return tbody;
    }
}
export default createHTMLElem;