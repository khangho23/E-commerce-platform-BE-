'use strict'

const { Schema, model } = require('mongoose') // Erase if already required
const { status } = require('../enums/order.enum')
const { DATABASE: { DOCUMENT_NAME, COLLECTION_NAME } } = require('../commons/constants')

// ENUMS
const statusEnums = Object.values(status) || []

// Declare the Schema of the Mongo model
const orderSchema = new Schema({
    user: {
        type: Number,
        // ref: DOCUMENT_NAME.USER,
        required: true
    }, // Current user is set hard fixed
    checkout: {
        type: Object,
        default: {}
    },
    shipping: {
        type: Object,
        default: {}
    },
    payment: {
        type: Object,
        default: {}
    },  
    products: {
        type: Array,
        required: true
    },
    trackingNumber: {
        type: String,
        default: '#0000118052022'
    },
    status: {
        type: String,
        enum: statusEnums,
        default: status.PENDING
    },
    
}, {
    collection: COLLECTION_NAME.ORDER,
    timestamps: true
})

//Export the model
module.exports = {
    order: model(DOCUMENT_NAME.ORDER, orderSchema)
}