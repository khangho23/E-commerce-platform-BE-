'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required
const { DATABASE: { DOCUMENT_NAME, COLLECTION_NAME } } = require('../commons/constants')

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    privateKey: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME.KEY_TOKEN
})

//Export the model
module.exports = model(DOCUMENT_NAME.KEY_TOKEN, keyTokenSchema)