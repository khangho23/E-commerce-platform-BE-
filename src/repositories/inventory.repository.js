'use strict'

const { inventory } = require('../models/inventory.model')
const { Types } = require('mongoose')

const insertInventory = async ({ shop, product, stock, location = 'unKnow' }) => {
    return await inventory.create({
        shop: new Types.ObjectId(shop),
        product: new Types.ObjectId(product),
        stock,
        location
    })
}

module.exports = {
    insertInventory
}