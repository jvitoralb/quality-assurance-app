## [English Translator](https://quality-assurance-app.onrender.com/english-translator)
As the name implies this project work as a translator between british english and north american english.

**To translate text from british english**, you must send a POST request with a body to `/english-translator/api/v1/translate`.  
The body should have 2 key-value pairs: text and locale.  
To set up the locale option is simple, if you wish the translation of a british text to american english use: `british-to-american` or `american-to-british` if you want to translate from american to british.

For example, to translate `Mangoes are my favorite fruit.` to american english, the post request body must be:
```
{
	text: 'Mangoes are my favorite fruit.',
	locale: 'american-to-british'
}
```
In this case, the answer will be an object with 2 key-value pairs: text and translation. The translation value is a string with the translated word wrapped with an HTML `span` element.
```
{
	text: 'Mangoes are my favorite fruit.',
	translation: 'Mangoes are my <span class=\"highlight\">favourite</span> fruit.'
}
```
**Note:**
- In case the text sent is in british english and was requested a british translation by the locale, the answer will still be an object with the keys `text` and `translation` but the translation value will be: `Everything looks good to me!`.
