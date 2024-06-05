'use strict'

const Shop = require('../models/shop.model')

/**
 * @decription Find by email
 * @param {Object} param0
 * @param {string} param0.email
 * @returns 
 * @throws {Error}
 */
const findByEmail = async ({ email, select = {
    email: 1, password: 2, name: 1, status: 1, roles: 1
} }) => {
    // const apiKey = crypto.randomBytes(64).toString('hex')
    // const newKey = await ApiKeyModel.create({ key: apiKey, permissions: ['0000'] })

    // console.log(newKey)

    return await Shop.findOne({ email }).select(select).lean()
}

module.exports = {
    findByEmail
}