'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmout))
router.get('/product-codes', asyncHandler(discountController.getAllDiscountCodesWithProducts))

// --- AUTHENTICATION ---
router.use(authentication)
router.route('')
    .get(asyncHandler(discountController.getAllDiscountCodesWithProducts))
    .post(asyncHandler(discountController.createDiscount))

module.exports = router