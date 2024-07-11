'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model')
const { Types } = require('mongoose')
const { getSelectedData, unGetSelectedData, convertToObjectIdMongoDB } = require('../utils')

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
        { shop: convertToObjectIdMongoDB(shop), _id: convertToObjectIdMongoDB(productId) },
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
 * @description Search products
 * @param {*} keySearch 
 * @returns 
 * @throws {Error}
 */
const searchProductsByUser = async ({ keySearch }) => {
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

/**
 * @description Find all products
 * @param {Object} param0
 * @param {number} param0.limit
 * @param {string} param0.sort
 * @param {number} param0.page
 * @param {Object} param0.filter
 * @param {string} param0.select
 * @returns
 * @throws {Error}
 */
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

/**
 * @description Find product by id
 * @param {Object} param0
 * @param {string} param0.productId
 * @param {string} param0.unSelect
 * @returns
 * @throws {Error}
 */
const findProduct = async ({ productId, unSelect }) => {
    return await product.findById(productId).select(unGetSelectedData(unSelect)).lean() || null
}

const findProductSelectedFields = async ({ productId, select = [] }) => {
    return await product.findById(convertToObjectIdMongoDB(productId))
        .select(getSelectedData(select)).lean() || null
}

const checkProductById = async (productId) => {
    return await product.exists({ _id: convertToObjectIdMongoDB(productId) })
}

/**
 * @description Update product
 * @param {string} productId 
 * @param {Object} data 
 * @returns 
 * @throws {Error}
 */
const updateProduct = async (productId, data) => {
    return await product.findByIdAndUpdate(productId, data, { new: true }).lean() || null
}

/**
 * @description Update product by id
 * @param {Object} param0
 * @param {string} param0.productId
 * @param {Object} param0.payload
 * @param {Object} param0.model
 * @param {boolean} param0.isNew 
 * @returns 
 * @throws {Error}
 */
const updateProductById = async ({ productId, payload, model, isNew = true }) => {
    return await model.findByIdAndUpdate(productId, payload, { new: isNew }).lean() || null
}

const getProductById = async (productId) => {
    return await product.findById(convertToObjectIdMongoDB(productId)).lean() || null
}

const checkProductByServer = async (products) => {
    return await Promise.all(products.map(async (product) => {
        const foundProduct = await getProductById(product._id);
        if (foundProduct)
            return {
                _id: foundProduct._id,
                price: foundProduct.price,
                quantity: product.quantity,
            };
    }));
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishedForShop,
    publishedProductByShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProduct,
    findProductSelectedFields,
    checkProductById,
    updateProduct,
    updateProductById,
    getProductById,
    checkProductByServer
}