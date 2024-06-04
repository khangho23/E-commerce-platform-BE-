'use strict'

const httpStatus = require('http-status-codes')
const AccessService = require('../services/access.service')
const { CREATED, OK } = require('../cores/success.response')
const {HEADER} = require('../commons/constants')

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

    logout = async (req, res, next) => {
        new OK({
            message: 'Logged out!',
            metadata: await AccessService.logout({ keyStore: req.keyStore })
        }).send(res)
    }

    handleRefreshToken = async (req, res, next) => {
        new OK({
            message: 'Get token successfully!',
            metadata: await AccessService.handleRefreshToken({
                refreshToken: req.headers[HEADER.REFRESH_TOKEN],
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }
}

module.exports = new AccessController