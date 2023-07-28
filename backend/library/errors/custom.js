class CustomError extends Error {
    constructor(message, statusCode, info) {
        super(message)
        this.status= statusCode
        this.info = info
    }
}

export default CustomError