'use strict'

const DiscountService = require('../services/discount.service')
const { CREATED, OK } = require('../cores/success.response')

class DiscountController {
    createDiscount = async (req, res, next) => {
        new CREATED({
            message: 'Discount created!',
            metadata: await DiscountService.createDiscount({
                ...req.body,
                shop: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodesByShop = async (req, res, next) => {
        new OK({
            message: 'All discount codes',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shop: req.user.userId
            })
        }).send(res)
    }

    getDiscountAmout = async (req, res, next) => {
        new OK({
            message: 'All discount amount',
            metadata: await DiscountService.getDiscountAmout({
                ...req.body
            })
        }).send(res)
    }

    getAllDiscountCodesWithProducts = async (req, res, next) => {
        new OK({
            message: 'All discount codes with product',
            metadata: await DiscountService.getAllDiscountCodesWithProducts({
                ...req.query
            })
        }).send(res)
    }
}

module.exports = new DiscountController()