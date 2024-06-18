'use strict'

const express = require('express')
const cartController = require('../../controllers/cart.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

// --- AUTHENTICATION ---
router.use(authentication)

router.route('/')
    .get(asyncHandler(cartController.getCartByUserId))
    .post(asyncHandler(cartController.addToCart))
    .put(asyncHandler(cartController.updateCart))
    .delete(asyncHandler(cartController.deleteProductFromCart))

module.exports = router