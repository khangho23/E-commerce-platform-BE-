'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model')
const { Types } = require('mongoose')
const { getSelectedData, unGetSelectedData } = require('../utils')

// --- Private functions ---
const queryProductByShop = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate({
            path: 'shop',
            select: '-_id name email'
        })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const updateDraftAndPublished = async ({ shop, productId, isDraft, isPublished }) => {
    return await product.findByIdAndUpdate(
        { shop: new Types.ObjectId(shop), _id: new Types.ObjectId(productId) },
        { isDraft, isPublished },
        { new: true }
    ) || null
}
// --- End private functions ---

/**
 * @description Query products by shop
 * @param {Object} obj
 * @param {string} obj.query
 * @param {string} obj.limit
 * @param {string} obj.skip 
 * @returns 
 * @throws {Error}
 */
const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProductByShop({ query, limit, skip })
}

/**
 * @description Query products by shop
 * @param {Object} obj
 * @param {string} obj.query
 * @param {string} obj.limit
 * @param {string} obj.skip 
 * @returns 
 * @throws {Error}
 */
const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await queryProductByShop({ query, limit, skip })
}

/**
 * @description Publish a product by shop
 * @param {Object} obj
 * @param {string} obj.shop
 * @param {string} obj.productId
 * @returns {Promise<Object|null>}
 * @throws {Error}
 */
const publishedProductByShop = async ({ shop, productId }) => {
    return await updateDraftAndPublished({ shop, productId, isDraft: false, isPublished: true })
}

/**
 * @description Publish a product by shop
 * @param {Object} obj
 * @param {string} obj.shop
 * @param {string} obj.productId
 * @returns {Promise<Object|null>}
 * @throws {Error}
 */
const unPublishProductByShop = async ({ shop, productId }) => {
    return await updateDraftAndPublished({ shop, productId, isDraft: true, isPublished: false })
}

/**
 * 
 * @param {*} keySearch 
 * @returns 
 * @throws {Error}
 */
const searchProductsByUser = async ({keySearch}) => {
    const regexSearch = new RegExp(keySearch, 'i')

    return await product.find(
        {
            isPublished: true,
            $text: { $search: regexSearch }
        },
        { score: { $meta: 'textScore' } }
    )
        .sort({ score: { $meta: 'textScore' } })
        .lean() || []
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
   
    return await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectedData(select))
        .lean() || []
}

const findProduct = async ({productId, unSelect}) => {
    return await product.findById(productId).select(unGetSelectedData(unSelect)).lean() || null
}

const updateProduct = async (productId, data) => {
    return await product.findByIdAndUpdate(productId, data, { new: true }).lean() || null
}

const updateProductById = async ({productId, payload, model, isNew = true}) => {
    return await model.findByIdAndUpdate(productId, payload, { new: isNew }).lean() || null
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishedForShop,
    publishedProductByShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProduct,
    updateProduct,
    updateProductById
}