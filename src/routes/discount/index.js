'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmout))
router.get('/product-codes', asyncHandler(discountController.getAllDiscountCodesWithProducts))
router.get('/all-products', asyncHandler(discountController.getAllDiscountCodesWithProducts))

// --- AUTHENTICATION ---
router.use(authentication)
router.route('')
    .get(asyncHandler(discountController.getAllDiscountCodesByShop))
    .post(asyncHandler(discountController.createDiscount))

module.exports = router