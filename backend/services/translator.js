import american from '../utils/translator/american.js';
import british from '../utils/translator/british.js';
import spelling from '../utils/translator/spellingAmericanBritish.js';
import titles from '../utils/translator/titlesAmericanBritish.js';


class WordUtility {
    constructor() {
        this.word = ''
    }
    upperCase = () => {
        this.word = this.word.slice(0, 1).toUpperCase() + this.word.slice(1);
    }
    addSpan = () => {
        return `<span class="highlight">${this.word}</span>`;
    }
}

class American extends WordUtility {
    constructor(text) {
        super();
        this.text = text;
        this.wordIndex = '';
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
            this.wordIndex = britihSpelling.indexOf(this.word);
            this.translation += this.getSpelling();

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
        return this.translation;
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
            this.translation += this.getSpelling();

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
        return this.translation;
    }
}

export default class Translator {
    constructor(locale, textInput) {
        this.textInput = textInput;
        this.locale = locale;
        this.translation = '';
        this.specialChar = '';
    }
    checkSpecialChars = () => {
        // just works for special the chars [ ?!.; ] at the end of the string
        if (this.specialChar.length) {
            this.translation += this.specialChar;
            this.textInput += this.specialChar;
        }
    }
    treatText = () => {
        // just works for special the chars [ ?!.; ] at the end of the string
        let specialChars = '?!.;';

        for(let j = 0; j < specialChars.length; j++) {
            if (this.textInput[this.textInput.length - 1] === specialChars[j]) {
                this.specialChar = this.textInput[this.textInput.length - 1];
                this.textInput = this.textInput.slice(0, this.textInput.length - 1);
            }
        }
    }
    defineEnglish = () => {
        /**
         *  Tem que arrumar isso.
         *  - Talvez usar Independecy Injection;
        **/
        if (this.locale === 'american-to-british') {
            let ref = new British(this.textInput);
            this.translation = ref.translate();
        } else if (this.locale === 'british-to-american') {
            let ref = new American(this.textInput);
            this.translation = ref.translate();
        } else {
            throw { error: 'Invalid value for locale field' }
        }
    }
    getTranslation = () => {
        this.treatText();
        this.defineEnglish();
        this.checkSpecialChars();
        if (this.translation === this.textInput) {
            return {
                text: this.textInput,
                translation: 'Everything looks good to me!'
            }
        }
        return {
            text: this.textInput,
            translation: this.translation
        }
    }
}