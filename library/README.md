## [Personal Library](https://quality-assurance-app.onrender.com/personal-library)
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
