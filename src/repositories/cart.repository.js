'use strict'

const { cart } = require('../models/cart.model')
const { state: stateEnums } = require('../enums/cart')

/**
 * @description Find discount by code and shop id
 * @param {Object} filter
 * @returns 
 */
const findCart = async ({ filter }) => {
    return await cart.findOne(filter).lean()
}

/**
 * @description Create a new cart
 * @param {Object} param0
 * @param {String} param0.user
 * @param {String} param0.product 
 * @returns 
 */
const createUserCart = async ({ user, product }) => {
    const query = { user, state: stateEnums.ACTIVE },
        updateOrInsert = {
            $addToSet: {
                products: product
            }
        }, options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateOrInsert, options)
}

/**
 * @description Update user cart
 * @param {Object} param0
 * @param {String} param0.user
 * @param {String} param0.product 
 * @returns 
 */
const updateUserCartQuantity = async ({ user, product }) => {
    const { productId, quantity } = product

    const query = {
        user,
        'products.product': productId,
        state: stateEnums.ACTIVE
    },
        updateSet = {
            $inc: {
                'products.$.quantity': quantity
            }
        },
        options = { upsert: true, new: true }

    return await cart.findOneAndUpdate(query, updateSet, options)
}

module.exports = {
    findCart,
    createUserCart,
    updateUserCartQuantity
}