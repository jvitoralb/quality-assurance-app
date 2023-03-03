# App projects
- [Metric Converter](#metric-imperial-converter)
- [Issue Tracker](#issue-tracker)
- [Personal Library](#personal-library)
- [Sudoku Solver](#sudoku-solver)
- [English Translator](#english-translator)


## [Metric-Imperial Converter]()
A simple metric-imperial converter with only 3 basic units of measurement:
- Length: we can convert Kilometers to Miles and vice-versa.
- Mass: we can convert Kilograms to Pounds and vice-versa.
- Volume: we can convert Liters to Gallons and vice-versa.

To convert any value, you must send the value and unit as value to an `input` key encoded in the URL.  
This means that to convert 10 kilograms to pounds `?input=10kg` should be added to the URL.  
All endpoints use `/api/v1`, so, in this case, the URL is `/metric-converter/api/v1/convert?input=4kg`.  
The answer to that call will be an object with 5 key-value pairs:
```
{
    "initNum":10,
    "initUnit":"kg",
    "returnNum":22.04624,
    "returnUnit":"lbs",
    "string":"10 kilograms converts to 22.04624 pounds"
}
```
The init keys are the value and unit sent for conversion, and the return keys are the value and unit converted, and there's a `string` key that is a message saying it.

**NOTE:**
- The API does not accept the name of the unit. This means you can't send `input=10kilometers`, you have to use `km`.
- To be aware of the accepted abbreviations (not case sensitive):  
  - `Kilometers - km`
  - `Kilograms- kg`
  - `Liters - l`
  - `Miles- mi`
  - `Pounds - lbs`
  - `Gallons - gal`
- If only the unit is sent - `input=kg` - it infers that the value is 1. So it will be converted from 1kg to pounds.
- If no unit is sent the answer will be an error message.
- If no unit and no value are sent, the answer will be an error message.

## [Issue Tracker]()
The idea behind this project was to create a tool to track issues on a project.

###### Create
**Creating a project** requires only a name.  
To create an issue, the model needs 6 pieces of information, some of which are required:
- Project name *required*
- Issue title *required*
- Issue text *required*
- Created by *required*
- Assigned to *optional*
- Status text *optional*
All this info must be sent as a body in a POST request to `/issue-tracker/api/v1/issues/{project name}`.  
In this case, the answer will be an object with 10 key-value pairs:
```
{
	"_id": "Issue id String",
	"project": "Project id String",
	"issue_title": "Issue title String",
	"issue_text": "Issue text String",
	"created_on": "Date String",
	"updated_on": "Date String",
	"created_by": "String",
	"assigned_to": "String",
	"open": true,
	"status_text": "String"
}
```

**Note:**
- The body keys must be all in small letters and the spaces must be replaced by `_` - *e.g.*: `project_name`, `issue_title`, `issue_text`, `created_by`.
- The project name is unique.

###### Read
**To retrieve all projects**, you must send a GET request to `/issue-tracker/api/v1/projects`.  
The answer will be an Array with all projects, and each project will have 3 key-value pairs:
```
[
    {
        "_id": "Project _id String",
        "name": "Project name String",
        "issues": [Issues id Strings]
    }
]
```

**To search project issues**, you need its name and send a GET request to `/issue-tracker/api/v1/issues/{project name}`.  
In this case, the answer will be an object with 3 key-value pairs:
```
{
    "_id": "Project _id String"
    "name": "Project name String"
    "issues": [Issues Objects]
}
```

**To make the search more precise**, you can use filters as queries. The options to send as filters are:
- Issue id
- Issue title
- Assigned to
- Created by
- Open

**Note:**
- The query keys must be all in small letters, and the spaces must be replaced by `_` - *e.g.*: `issue_id`, `issue_title`, `created_by`.

###### Update
**To update a project issue**, you must send a PUT request to `/issue-tracker/api/v1/issues/{project name}`.  
The request must have a body with the project name, issue id, and the fields to update.  
In this case, the answer will be an object with 2 key-value pairs:
```
{
	"result": "successfully updated",
	"_id": "Issue id String"
}
```

###### Delete
**To delete a project issue**, you must send a DELETE request to `/issue-tracker/api/v1/issues/{project name}`.  
The request must have a body with the issue id.  
In this case, the answer will be an object with 2 key-value pairs:
```
{
	"result": "successfully deleted",
	"_id": "Issue id String"
}
```

**To delete a project**, you must send a DELETE request to `/issue-tracker/api/v1/projects/{project name}`.  
In this case, the answer will be an object with 2 key-value pairs:
```
{
	"result": "successfully deleted",
	"name": "Project name String"
}
```

**Note:**
- When a project is deleted, all of its issues are deleted as well.

## [Personal Library]()
A simple library project in which we can store books and keep track of comments on all books.

###### Create
**Storing a book** requires:
- Book name ***required***
- Author name ***optional***

This info must be sent as a body in a POST request to `/personal-library/api/v1/books`.  
In this case, the answer will be an object with 3 key-value pairs:
```
{
	"_id": "Book id String",
	"title": "Book title String",
	"author": "Book Author name String"
}
```

**Note:**
- If the author's name is not sent the default value will be ***Unknown***

**Creating a comment** requires:
- Book id
- Text

This info must be sent as a body in a POST request to `/personal-library/api/v1/books/{book id}`.
In this case, the answer will be an array with the book object in it:
```
[
	{
		"_id": "Book id String",
		"title": "Book title String",
		"author": "Author name String",
		"commentcount": Number,
		"comments": [
			{
				"_id": "Comment id String",
				"text": "Comment text String",
				"created_on": "Date String",
				"created_by": "Ursinho Pooh!"
			}
		]
	}
]
```

**Note:**
- Book id presence in the body is indifferent, but I advise avoiding it.
- Comment created_by has ***Ursinho Pooh!*** as default value.

###### Read
**To retrieve all books**, you must send a GET request to `/personal-library/api/v1/books`.  
The answer will be an Array with all books objects:
```
[
	{
		"_id": "Book id String",
		"title": "Book title String",
		"author": "Author name String",
		"commentcount": Number
	}
]
```

**To search a specific book**, you need the book id and send a GET request to `/personal-library/api/v1/books/{book id}`.  
In this case, the answer will be an Array with a book object and all of its comments:
```
[
	{
		"_id": "Book id String",
		"title": "Book title String",
		"author": "Author name String",
		"commentcount": Number,
		"comments": [
			{
				"_id": "Comment id String",
				"text": "Comment text String",
				"created_on": "Date String",
				"created_by": "Ursinho Pooh!"
			}
		]
	}
]
```

###### Delete
**To delete a book**, you must send a DELETE request to `/personal-library/api/v1/books/{book id}`.  
The answer will be: 
```
{
	"message": "book delete successful",
	"_id": "Book id String",
	"comments": {
		"message": "all comments deleted",
		"book_id": "Book id String"
	}
}
```
**Note:**
- Deleting a book also deletes all of its comments.


**To delete all books**, you must send a DELETE request to `/personal-library/api/v1/books`.  
The answer will be: 
```
{
	"message": "complete delete successful",
	"comments": {
		"message": "all comments deleted"
	}
}
```

**To delete a comment**, you must send the comment's id as value to a `comment` key encoded in the URL.  
So, in this case, the DELETE request URL should be `/personal-library/api/v1/books/{book id}?comment={comment id}`.  
The answer will be:
```
{
	"message": "comment delete successful",
	"_id": "Comment id String"
}
```

## [Sudoku Solver]()
This is a simple project, and as the name implies is a sudoku solver but can also be used to check if a number is valid to be used in a given coordinate - we use coordinates to track all squares in a puzzle.

The game is divided into rows, columns, and areas.
Starting from the fact that the game is a larger area of `9X9` - that gives us `81 squares` to work with:
- Each `row` is composed of 9 squares, as well as each `column` and each `area` - in `3x3` format.
- Each `row` receives a letter from `A to I` as a coordinate is the first line - top - the letter `A` and the last line - base - the letter `I`.
- Each `column` receives as a coordinate a number from `1 to 9`, the first column - left, column `1`, and the last column - right - column `9`.

<p align="center">
    <img
        src="./frontend/public/images/sudoku-solver-usage.png"
        alt="Image explaining the sudoku grid coordinates"
    >
</p>

**To get the puzzle solved**, you must send a POST request with a body to `/sudoku-solver/api/v1/solve`.  
The body should be an object with a `puzzle` key and the value should be a string with all the numbers from the puzzle.

***Note: blank spaces should be replaced with `.`***

The following game should have a puzzle string that looks like this: `.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6`.

<p align="center">
    <img
        src="../frontend/public/images/full-sudoku-solver-img.png"
        alt="Image explaining the sudoku grid coordinates"
    >
</p>

In this case, the answer will be an object that looks like this:
```
{
	"message": "Puzzle solved",
	"solution": "473891265851726394926345817568913472342687951197254638734162589685479123219538746"
}
```

**Note:**
- The string must be `81 characteres long`.

**To validate a given value in a given coordinate in the puzzle**, you must send a POST request with a body to `/sudoku-solver/api/v1/check`.  
The body must have 3 key-value pairs: puzzle, coordinate, and value.

**Note:**
- The puzzle must be `81 characters long`.
- Coordinate should be 2 characters long composed of a letter and a number: e.g `A3`.
- The value must be a `number`.

In this case, the answer will be an object:
- If there are no conflicts: `{ "valid": true }`.
- If there are one or more conflicts:
```
{
	"valid": false,
	"conflict": [
		"row",
		"column",
		"region"
	]
}
```

## [English Translator]()
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