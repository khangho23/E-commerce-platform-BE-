'use strict'

const ApiKeyModel = require('../models/apiKey.model')

/**
 * @description Find discount by code and shop id
 * @param {Object} discount 
 * @param {string} discount.code
 * @param {string} discount.shop
 * @returns 
 */
const findById = async ({key, status = true}) => {
    // const apiKey = crypto.randomBytes(64).toString('hex')
    // const newKey = await ApiKeyModel.create({ key: apiKey, permissions: ['0000'] })

    // console.log(newKey)

    return await ApiKeyModel.findOne({ key, status: true }).lean()
}

module.exports = {
    findById
}