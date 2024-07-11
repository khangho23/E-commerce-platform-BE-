'use strict'

const { Schema, model } = require('mongoose') // Erase if already required
const { DATABASE: { DOCUMENT_NAME, COLLECTION_NAME } } = require('../commons/constants')

const inventorySchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    location: {
        type: String,
        default: 'unKnown'
    },
    stock: {
        type: Number,
        required: true
    },
    reservations: {
        type: Array,
        default: []
    },
}, {
    collection: COLLECTION_NAME.INVENTORY,
    timestamps: true
})

module.exports = {
    inventory: model(DOCUMENT_NAME.INVENTORY, inventorySchema)
}