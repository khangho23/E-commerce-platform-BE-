'use strict'

const ApiKeyModel = require('../models/apiKey.model')
const crypto = require('crypto')

const findById = async (key) => {
    // const apiKey = crypto.randomBytes(64).toString('hex')
    // const newKey = await ApiKeyModel.create({ key: apiKey, permissions: ['0000'] })

    // console.log(newKey)

    const objKey = await ApiKeyModel.findOne({ key, status: true }).lean()
    return objKey
}

module.exports = {
    findById
}