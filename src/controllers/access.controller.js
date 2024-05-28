'use strict'

const httpStatus = require('http-status-codes')
const AccessService = require('../services/access.service')
const { CREATED, OK } = require('../cores/success.response')

class AccessController {
    register = async (req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await AccessService.register(req.body)
        }).send(res)
    }

    login = async (req, res, next) => {
        new OK({
            message: 'Login OK!',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
}

module.exports = new AccessController