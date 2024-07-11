'use strict'

const { Schema, model } = require('mongoose') // Erase if already required
const { DATABASE: { DOCUMENT_NAME, COLLECTION_NAME } } = require('../commons/constants')

// Declare the Schema of the Mongo model
const apiKeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME.API_KEY
})

//Export the model
module.exports = model(DOCUMENT_NAME.API_KEY, apiKeySchema)