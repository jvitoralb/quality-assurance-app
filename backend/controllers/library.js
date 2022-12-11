class Books {
    constructor(bookId, title) {
        this._id = bookId
        this.title = title
        this.comments
    }

    deleteBooks = () => {
        // setup deletion for all books and single books
        if (this._id) {
            console.log({ message: 'book deleted', _id: this._id, title: this.title })
            return { message: 'book deleted', _id: this._id, title: this.title }
        }
        console.log({ message: 'all books deleted' })
        return { message: 'all books deleted' }
    }

    findBooks = () => {
        // setup find single book, all books and filters
        if (this._id) {//or use -> this._id || this.title
            return this
        }

        return [
            {title: 'book 1', _id: '02f312c3fc12sa3ljy'},
            {title: 'book 2', _id: '10dsfd12as3fc12asa'},
            ' ... ',
            {title: 'book n', _id: 'nnnnnnnnnnnnn'},
        ]
    }

    createBooks = () => {
        console.log(this.title, 'created')
    }
}

class Comments  {
    constructor(text, bookId) {
        this._id
        this.book_id = bookId
        this.text = text
        this.created_on
        //creatd_by
    }

    commentsAndBooks = (option) => {
        //book.findAndUpdate($push || $pull -> this._id)
        console.log(`Comment ${this._id} ${option}ed ${option == '$pull' ? 'out of' : 'in'} book ${this.book_id}`)
    }

    deleteComments = (singleComment) => {
        // setup deletion for all Comments and single Comments
        if (singleComment) {
            console.log({ message: 'comment deleted', _id: this._id, book_id: this.book_id })
            this.commentsAndBooks('$pull')
            return { message: 'comment deleted', _id: this._id, book_id: this.book_id, comment: this.text }
        }

        if (this.book_id) {
            console.log({ message: 'all comments deleted', book_id: this.book_id })
            return { message: 'all comments deleted', book_id: this.book_id }
        }

        console.log({ message: 'all comments deleted' })
        return { message: 'all comments deleted' }
    }

    // findComments = () => {
    //     // setup find single Comment, all Comments and filters
    //     console.log(this.text, 'found')
    // }

    createComments = () => {// need to push the created comment to book.comments[]
        this.created_on = new Date()
        console.log(this.text, 'created')
        this.commentsAndBooks('$push')
        return this
    }
}

export const libraryHandleGet = async (req, res, next) => {
    const refBook = new Books(req.params._id)

    try {
        const result = refBook.findBooks()
        res.send(result)
    } catch(err) {
        next(err)
    }
}

export const libraryHandlePost = async (req, res, next) => {
    const refBook = new Books(req.params._id, req.body.title)
    const refComment = new Comments(req.body.text, req.params._id)

    try {
        if (req.params._id) {
            const resultC = refComment.createComments()
            //insert comment in book.comments[]
            res.json(resultC) //due to multiple responses inside same controller - must create handler
            return
        }

        const resultB = refBook.createBooks()
        res.json(resultB) //due to multiple responses inside same controller - must create handler
    } catch(err) {
        next(err)
    }
}

export const libraryHandleDelete = async (req, res, next) => {
    const refBook = new Books(req.params._id)
    const refComment = new Comments(null, req.params._id)

    try {
        if (req.query.comment) {
            // to delete a singleComment on a book - fcc does not require this
            const deletedCommentId = refComment.deleteComments(true)
            //pull comment out of book.comments[]
            res.json({ deletedCommentId, _id: 'pipipipopopo'}) //due to multiple responses inside same controller - must create handler
            return
        }

        const commentResult = refComment.deleteComments()
        const bookResult = refBook.deleteBooks()
        res.json({ message: 'successful deletion', commentResult, bookResult }) //due to multiple responses inside same controller - must create handler
    } catch(err) {
        next(err)
    }
}