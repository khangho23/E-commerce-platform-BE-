'use strict'

const { Schema, model } = require('mongoose') // Erase if already required
const { state } = require('../enums/cart')
const { DATABASE: { DOCUMENT_NAME, COLLECTION_NAME } } = require('../commons/constants')

// ENUMS
const stateEnums = Object.values(state) || []

// Declare the Schema of the Mongo model
const cartSchema = new Schema({
    user: {
        // type: Schema.Types.ObjectId,
        // ref: 'User',
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: stateEnums,
        default: state.ACTIVE
    },
    products: {
        type: Array,
        required: true,
        default: []
    },
    countProducts: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    collection: COLLECTION_NAME.CART,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
})

//Export the model
module.exports = {
    cart: model(DOCUMENT_NAME.CART, cartSchema)
}