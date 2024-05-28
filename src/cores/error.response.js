'use strict'

const httpStatus = require('http-status-codes')

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor (message = httpStatus.ReasonPhrases.CONFLICT, statusCode = httpStatus.CONFLICT) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor (message = httpStatus.ReasonPhrases.BAD_REQUEST, statusCode = httpStatus.BAD_REQUEST) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse{
    constructor (message = httpStatus.ReasonPhrases.UNAUTHORIZED, statusCode = httpStatus.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError
}