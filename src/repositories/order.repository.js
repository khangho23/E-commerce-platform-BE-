'use strict'

const { order } = require('../models/order.model')
const {
    convertToObjectIdMongoDB
} = require('../utils')

const create = async (data) => {
    return await order.create(data)
}

module.exports = {
    create
}