'use strict'

const { Schema, model } = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'inventories'

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
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}