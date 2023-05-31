import american from './utils/american.js';
import british from './utils/british.js';
import spelling from './utils/spellingAmericanBritish.js';
import titles from './utils/titlesAmericanBritish.js';


class WordUtility {
    constructor() {
        this.word = '';
        this.specialChar = '';
        this.charStatus = false;
    }
    upperCase = () => {
        this.word = this.word.slice(0, 1).toUpperCase() + this.word.slice(1);
    }
    addSpan = () => {
        return `<span class="highlight">${this.word}</span>`;
    }
    getSpecialChar = () => {
        if (this.charStatus) {
            this.charStatus = false;
            return this.specialChar;
        }
        return '';
    }
    treatWord = () => {
        let specialChars = '?!,.;';

        for(let j = 0; j < specialChars.length; j++) {
            if (this.word[this.word.length - 1] === specialChars[j]) {
                this.charStatus = true;
                this.specialChar = specialChars[j];
                this.word = this.word.slice(0, this.word.length - 1);
            }
        }
    }
}

class American extends WordUtility {
    constructor(text) {
        super();
        this.text = text;
        this.wordIndex = null;
        this.translation = '';
    }
    checkTitle = () => {
        let americanTitles = Object.keys(titles);
        let britishTitles = Object.values(titles);

        for (let i = 0; i < britishTitles.length; i++) {
            let target = new RegExp(`\\b${britishTitles[i]}\\b`, 'i');

            if (this.translation.match(target)) {
                this.word = americanTitles[i];
                this.upperCase();
                this.translation = this.translation.replace(target, this.addSpan())
            }
        }
    }
    getSpelling = () => {
        const americanSpelling = Object.keys(spelling);

        if (this.wordIndex >= 0) {
            this.word = americanSpelling[this.wordIndex];
            return this.addSpan();
        }

        return this.word;
    }
    checkSpelling = () => {
        const britihSpelling = Object.values(spelling);
        let splitText = this.text.split(' ');

        for(let i = 0; i < splitText.length; i++) {
            this.word = splitText[i];
            this.treatWord();
            this.wordIndex = britihSpelling.indexOf(this.word);
            this.translation += this.getSpelling();
            this.translation += this.getSpecialChar();

            if (i + 1 < splitText.length) {
                this.translation += ' ';
            }
        }
    }
    checkWord = () => {
        let britishWords = Object.keys(british);

        for (let i = 0; i < britishWords.length; i++) {
            let target = new RegExp(`\\b${britishWords[i]}\\b`, 'i');
            let validMatch = this.translation.match(target);

            if (validMatch && this.translation[validMatch.index - 1] !== '-') {
                this.word = british[britishWords[i]];
                this.translation = this.translation.replace(target, this.addSpan());
            }
        }
    }
    timePattern = () => {
        let hoursPattern = this.translation.match(/[0-9]+.[0-9]+/);
        if (hoursPattern) {
            this.word = hoursPattern[0].replace('.', ':');
            this.translation = this.translation.replace(hoursPattern[0], this.addSpan());
        }
    }

    translate = () => {
        this.checkSpelling();
        this.checkWord();
        this.timePattern();
        this.checkTitle();
    }
}

class British extends WordUtility {
    constructor(text) {
        super();
        this.text = text;
        this.translation = '';
    }
    checkTitle = () => {
        let americanTitles = Object.keys(titles);

        for (let i = 0; i < americanTitles.length; i++) {
            let target = new RegExp(americanTitles[i], 'i');

            if (this.translation.match(target)) {
                this.word = titles[americanTitles[i]];
                this.upperCase();
                this.translation = this.translation.replace(target, this.addSpan());
            }
        }
    }
    getSpelling = () => {
        if (spelling[this.word]) {
            this.word = spelling[this.word];
            return this.addSpan();
        }
        return this.word;
    }
    checkSpelling = () => {
        let splitText = this.text.split(' ');

        for (let i = 0; i < splitText.length; i++) {
            this.word = splitText[i];
            this.treatWord();
            this.translation += this.getSpelling();
            this.translation += this.getSpecialChar();

            if (i + 1 < splitText.length) {
                this.translation += ' ';
            }
        }
    }
    checkWord = () => {
        let americanWords = Object.keys(american);

        for (let i = 0; i < americanWords.length; i++) {
            let target = new RegExp(`\\b${americanWords[i]}\\b`, 'i');

            if (this.translation.match(target)) {
                this.word = american[americanWords[i]];
                this.translation = this.translation.replace(target, this.addSpan());
            }
        }
    }
    timePattern = () => {
        let hoursPattern = this.translation.match(/[0-9]+:[0-9]+/);
        if (hoursPattern) {
            this.word = hoursPattern[0].replace(':', '.');
            this.translation = this.translation.replace(hoursPattern[0], this.addSpan());
        }
    }

    translate = () => {
        this.checkSpelling();
        this.checkWord();
        this.timePattern();
        this.checkTitle();
    }
}

export default class Translator {
    constructor(locale, textInput) {
        this.locale = locale;
        this.textInput = textInput;
        this.english;
        this.languages = {
            'american-to-british': (text) => new British(text),
            'british-to-american': (text) => new American(text)
        }
    }
    setEnglish = () => {
        if (this.languages[this.locale]) {
            this.english = this.languages[this.locale](this.textInput);
        } else {
            throw { error: 'Invalid value for locale field' }
        }
    }
    getTranslation = () => {
        this.setEnglish();
        this.english.translate();

        if (this.english.translation === this.textInput) {
            return {
                text: this.textInput,
                translation: 'Everything looks good to me!'
            }
        }
        return {
            text: this.textInput,
            translation: this.english.translation
        }
    }
}