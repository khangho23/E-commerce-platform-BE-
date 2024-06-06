'use strict'

const apiKey = require('../models/apiKey.model')

/**
 * @description Find discount by code and shop id
 * @param {Object} discount 
 * @param {string} discount.code
 * @param {string} discount.shop
 * @returns 
 */
const findById = async ({ key, status = true }) => {
    return await apiKey.findOne({ key, status }).lean()
}

module.exports = {
    findById
}