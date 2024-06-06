'use strict'

const { BadRequestError, NotFoundError } = require('../cores/error.response')
const { convertToObjectIdMongoDB } = require('../utils')
const { findByCodeAndShopId, insertDiscount, findAllDiscountCodesUnSelect, findOneAndDelete } = require('../repositories/discount.repository')
const { applyTo: applyToEnums, type: typeEnums, type } = require('../enums/discount')
const { findAllProducts } = require('../repositories/product.repository')
const { discount } = require('../models/discount.model')

class DiscountService {
    /**
     * @description Create new discount code
     * @param {Object} payload
     * @returns {Promise<Object>} newDiscount
     * @throws {Error}
     */
    static async createDiscount(payload) {
        const {
            code, startDate, endDate, isActive,
            shop, minOrderValue, productIds, applyTo,
            name, description, type, value, maxValue,
            maxUses, usesCount, maxUsesPerUser, usersUsed
        } = payload

        if (new Date(startDate) > new Date() || new Date(endDate) < new Date())
            throw new BadRequestError('Discount is expired')

        if (new Date(startDate) > new Date(endDate))
            throw new BadRequestError('Start date must be less than end date')

        const foundDiscount = await findByCodeAndShopId({ code, shop })

        if (foundDiscount && foundDiscount.isActive)
            throw new NotFoundError('Discount code already exists')

        const newDiscount = await insertDiscount({
            code,
            startDate,
            endDate,
            isActive,
            shop: convertToObjectIdMongoDB(shop),
            minOrderValue,
            productIds: applyTo === 'all' ? [] : productIds,
            applyTo,
            name, description, type, value, maxValue,
            maxUses, usesCount, maxUsesPerUser, usersUsed
        })

        return newDiscount
    }

    static async updateDiscountCode(payload) {
    }

    /**
     * @description Get all discount codes with specific product
     * @param {Object} param0
     * @param {string} param0.shop
     * @param {string} param0.product
     * @param {string} param0.user
     * @param {number} param0.limit
     * @param {number} param0.page
     * @returns {Promise<Object>}
     * @throws {Error} 
     */
    static async getAllDiscountCodesWithProducts({
        shop, product, user, limit, page
    }) {
        // Create index for discount collection
        const foundDiscount = await findByCodeAndShopId({ code, shop })

        if (!foundDiscount || !foundDiscount.isActive)
            throw new NotFoundError('Discount code not found')

        const { applyTo, productIds } = foundDiscount
        let products

        if (applyTo === applyToEnums.ALL) {
            // Get all products
            products = await findAllProducts({
                filter: {
                    shop: convertToObjectIdMongoDB(shop),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['name']
            })
        }

        if (applyTo === applyToEnums.SPECIFIC_PRODUCT) {
            // Get specific products ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: productIds },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['name']
            })
        }

        return products
    }

    static async getAllDiscountCodesByShop({ shop, limit, page }) {
        return await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                shop: convertToObjectIdMongoDB(shop),
                isActive: true
            },
            unSelect: ['__v', 'shop'],
            model: discount
        })
    }

    /**
     * @description Apply discount code to order
     * @param {Object} param0
     * @param {string} param0.code
     * @param {string} param0.shop
     * @param {string} param0.user
     * @param {Array<string>} param0.productIds
     * @returns {Promise<Object>}
     * @throws {Error}
     */
    static async getDiscountAmout({ code, shop, userId, productIds }) {
        const foundDiscount = await findByCodeAndShopId({ code, shop })

        if (!foundDiscount || !foundDiscount.isActive)
            throw new NotFoundError('Discount code not found')

        const {
            isActive,
            maxUses,
            startDate,
            endDate,
            minOrderValue,
            maxUsesPerUser,
            usersUsed,
            value
        } = foundDiscount

        if (!isActive)
            throw new NotFoundError('Discount code is not active')

        if (maxUses === 0)
            throw new NotFoundError('Discount code is too many uses')

        if (new Date() < new Date(startDate) || new Date() > new Date(endDate))
            throw new NotFoundError('Discount code is expired')

        // Check min order value to apply discount
        let totalOrder = 0
        if (minOrderValue > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < minOrderValue)
                throw new NotFoundError('Min order value is not enough to apply discount')
        }

        if (maxUsesPerUser > 0) {
            const userUsed = usersUsed.find(user => user === userId)
            if (userUsed)
                throw new NotFoundError('User used discount code too many times')
        }

        const amount = type === typeEnums.FIXED_AMOUNT ? value : (totalOrder * value) / 100

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    /**
     * @description Delete discount code
     * @param {Object} param0
     * @param {string} param0.shop
     * @param {string} param0.code 
     * @returns 
     * @throws {Error}
     */
    static async deleteDiscountCode({ shop, code }) {
        return await findOneAndDelete({ shop: convertToObjectIdMongoDB(shop), code })
    }

    static async cancelDiscountCode({ shop, code, user }) {
        const foundDiscount = await findByCodeAndShopId({ code, shop: convertToObjectIdMongoDB(shop) })

        if (!foundDiscount || !foundDiscount.isActive)
            throw new NotFoundError('Discount code not found')

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: { usersUsed: user },
            $inc: {
                maxUses: 1,
                usesCount: -1
            }
        })

        return result
    }
}

module.exports = DiscountService