'use strict'

const { Schema, model } = require('mongoose') // Erase if already required
const { state } = require('../enums/notification.enum')
const { DATABASE: { DOCUMENT_NAME, COLLECTION_NAME } } = require('../commons/constants')

// ENUMS
const stateEnums = Object.values(state) || []

// Declare the Schema of the Mongo model
const notificationSchema = new Schema({
    type: {
        type: String,
        enum: stateEnums,
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: DOCUMENT_NAME.SHOP
    },
    receivedId: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    options: {
        type: Object,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME.NOTIFICATION
})

//Export the model
module.exports = {
    notification: model(DOCUMENT_NAME.NOTIFICATION, notificationSchema)
}