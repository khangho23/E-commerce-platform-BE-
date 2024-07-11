'use strict'

const { Schema, model } = require('mongoose')
const { DATABASE: { DOCUMENT_NAME, COLLECTION_NAME } } = require('../commons/constants')

const commentSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        // ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    left: {
        type: Number,
    },
    right: {
        type: Number
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME.COMMENT
})

module.exports = {
    comment: model(DOCUMENT_NAME.COMMENT, commentSchema)
}