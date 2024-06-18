'use strict'

const { discount } = require('../models/discount.model')
const { unGetSelectedData, getSelectedData, convertToObjectIdMongoDB } = require('../utils')
const { applyTo: applyToEnums } = require('../enums/discount')

/**
 * @description Find discount by code and shop id
 * @param {Object} discount 
 * @param {string} discount.code
 * @param {string} discount.shop
 * @returns 
 */
const findByCodeAndShopId = async ({ code, shop }) => {
    return await discount.findOne({
        code,
        shop: convertToObjectIdMongoDB(shop)
    }).lean()
}

/**
 * @description Insert new discount code
 * @param {Object} discount
 * @param {string} discount.code
 * @param {Date} discount.startDate
 * @param {Date} discount.endDate
 * @param {boolean} discount.isActive
 * @param {mongoose.Types.ObjectId} discount.shop
 * @param {number} discount.minOrderValue
 * @param {Array<mongoose.Types.ObjectId>} discount.productIds
 * @param {string} discount.applyTo
 * @param {string} discount.name
 * @param {string} discount.description
 * @param {string} discount.type
 * @param {number} discount.value
 * @param {number} discount.maxValue
 * @param {number} discount.maxUses
 * @param {number} discount.usesCount
 * @param {number} discount.maxUsesPerUser
 * @param {Array<mongoose.Types.ObjectId>} discount.usersUsed
 * @returns {Promise<discount>}
 * @throws {Error}
 */
const insertDiscount = async ({
    code, startDate, endDate, isActive,
    shop, minOrderValue = 0, productIds,
    applyTo = productIds.length > 0 ? applyToEnums.SPECIFIC_PRODUCT : applyToEnums.ALL,
    name, description, type, value, maxValue,
    maxUses, usesCount, maxUsesPerUser, usersUsed
}) => {
    return await discount.create({
        code, startDate, endDate, isActive,
        shop, minOrderValue, productIds, applyTo,
        name, description, type, value, maxValue,
        maxUses, usesCount, maxUsesPerUser, usersUsed
    })
}

/**
 * @description Find all discount codes with specific product
 * @param {Object} param0
 * @param {number} param0.limit
 * @param {number} param0.page
 * @param {string} param0.sort
 * @param {Object} param0.filter
 * @param {string} param0.unSelect
 * @param {Object} param0.model
 * @returns
 * @throws {Error}
 */
const findAllDiscountCodesUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime',
    filter = {}, unSelect, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    return await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectedData(unSelect))
        .lean() || []
}

const findAllDiscountCodesSelect = async ({
    limit = 50, page = 1, sort = 'ctime',
    filter = {}, select, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    return await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectedData(select))
        .lean() || []
}

/**
 * @description Find one and delete
 * @param {Object} param0
 * @param {Object} param0.filter
 * @returns
 * @throws {Error}
 */
const findOneAndDelete = async ({ filter }) => {
    return await discount.findOneAndDelete(filter).lean() || null
}

/**
 * @description Find by id and update
 * @param {Object} param0
 * @param {Object} param0.filter
 * @param {Object} param0.update
 * @returns
 * @throws {Error}
 */
const findByIdAndUpdate = async ({ filter, update }) => {
    return await discount.findByIdAndUpdate(filter, update, { new: true }).lean() || null
}

module.exports = {
    findByCodeAndShopId,
    insertDiscount,
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    findOneAndDelete,
    findByIdAndUpdate
}