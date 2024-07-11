'use strict'

const express = require('express')
const DiscountController = require('../../controllers/discount.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.post('/amount', asyncHandler(DiscountController.getDiscountAmout))
router.get('/product-codes', asyncHandler(DiscountController.getAllDiscountCodesWithProducts))
router.get('/all-products', asyncHandler(DiscountController.getAllDiscountCodesWithProducts))

// --- AUTHENTICATION ---
router.use(authentication)
router.route('')
    .get(asyncHandler(DiscountController.getAllDiscountCodesByShop))
    .post(asyncHandler(DiscountController.createDiscount))

module.exports = router