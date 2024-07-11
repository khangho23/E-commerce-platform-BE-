'use strict'

const { inventory } = require('../models/inventory.model')
const {
    convertToObjectIdMongoDB
} = require('../utils')

const insertInventory = async ({ shop, product, stock, location = 'unKnow' }) => {
    return await inventory.create({
        shop: convertToObjectIdMongoDB(shop),
        product: convertToObjectIdMongoDB(product),
        stock,
        location
    })
}

const reservationInventory = async ({ product, quantity, cart }) => {
    return await inventory.updateOne({
        product: convertToObjectIdMongoDB(product),
        stock: { $gte: quantity }
    }, {
        $inc: { stock: -quantity },
        $push: {
            reservations: {
                quantity,
                cart,
                createOn: new Date()
            }
        }
    })
}

const increaseStock = async ({ shop, product, quantity, location }) => {
    return await inventory.findOneAndUpdate({
        shop: convertToObjectIdMongoDB(shop),
        product: convertToObjectIdMongoDB(product)
    }, {
        $inc: { stock: quantity },
        $set: { location }
    }, { new: true })
}

module.exports = {
    insertInventory,
    reservationInventory,
    increaseStock
}