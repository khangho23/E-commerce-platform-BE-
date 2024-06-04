'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.get('/search', asyncHandler(productController.searchProductsByUser))
router.get('/all', asyncHandler(productController.findAllProducts))
router.get('/:productId', asyncHandler(productController.findProduct))

// Middleware
router.use(authentication)

// --- POST ---
router.route('/')
    .post(asyncHandler(productController.createProduct))
// --- END POST ---

// --- PATCH ---
router.patch('/:productId', asyncHandler(productController.updateProduct))
// --- END PATCH ---

// --- PUT ---
router.put('/publish/:productId', asyncHandler(productController.publishProductByShop))
router.put('/unpublish/:productId', asyncHandler(productController.unPublishProductByShop))
// --- END PUT ---

// --- QUERY ---
router.get('/drafts', asyncHandler(productController.findAllDraftsForShop))
router.get('/published', asyncHandler(productController.findAllPublishedForShop))
// --- END QUERY ---

module.exports = router