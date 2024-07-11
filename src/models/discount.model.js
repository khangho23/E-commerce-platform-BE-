'use strict'

const { Schema, model } = require('mongoose') // Erase if already required
const { applyTo, type } = require('../enums/discount')
const { DATABASE: { DOCUMENT_NAME, COLLECTION_NAME } } = require('../commons/constants')

// ENUMS
const applyToArray = Object.values(applyTo) || []

const discountSchema = new Schema({
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: type.FIXED_AMOUNT // percentage, fixed_amount
    },
    value: {
        type: Number,
        required: true
    }, // 10.000, 10%
    code: {
        type: String,
        required: true
    }, // discount's code, Ex: BLACKFRIDAY2021
    startDate: {
        type: Date,
        required: true
    }, // discount's start date
    endDate: {
        type: Date,
        required: true
    }, // discount's expiration date
    maxUses: {
        type: Number,
        required: true
    }, // discount's quantity limit
    maxUsesPerUser: {
        type: Number,
        required: true
    }, // discount's quantity limit per user
    usersUsed: {
        type: Array,
        default: []
    }, // users who used the discount
    maxUsesPerUser: {
        type: Number,
        required: true
    }, // discount's quantity limit per user
    minOrderValue: {
        type: Number,
        required: true,
        default: 0
    }, // discount's minimum order value
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }, // discount's status
    applyTo: {
        type: String,
        required: true,
        enum: applyToArray,
    }, // products that the discount applies to
    productIds: {
        type: Array,
        default: []
    }, // products that the discount applies to
}, {
    collection: COLLECTION_NAME.DISCOUNT,
    timestamps: true
})

module.exports = {
    discount: model(DOCUMENT_NAME.DISCOUNT, discountSchema)
}