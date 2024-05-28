'use strict'

const httpStatus = require('http-status-codes')

class SuccessResponse {
    constructor({message, statusCode = httpStatus.OK, reasonStatusCode = httpStatus.ReasonPhrases.OK, metadata = {}}) {
        this.message = message || reasonStatusCode
        this.status = statusCode,
        this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata})
    }
}

class CREATED extends SuccessResponse {
    constructor({message, statusCode = httpStatus.CREATED, reasonStatusCode = httpStatus.ReasonPhrases.CREATED, metadata, options = {}}) {
        super({message, statusCode, reasonStatusCode, metadata})
        this.options = options
    }
}

module.exports = {
    OK,
    CREATED
}