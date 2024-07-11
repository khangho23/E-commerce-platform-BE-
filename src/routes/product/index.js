'use strict'

const express = require('express')
const ProductController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

router.get('/search', asyncHandler(ProductController.searchProductsByUser))
router.get('/all', asyncHandler(ProductController.findAllProducts))
router.get('/:productId', asyncHandler(ProductController.findProduct))

// Middleware
router.use(authentication)

// --- POST ---
router.route('/')
    .post(asyncHandler(ProductController.createProduct))
// --- END POST ---

// --- PATCH ---
router.patch('/:productId', asyncHandler(ProductController.updateProduct))
// --- END PATCH ---

// --- PUT ---
router.put('/publish/:productId', asyncHandler(ProductController.publishProductByShop))
router.put('/unpublish/:productId', asyncHandler(ProductController.unPublishProductByShop))
// --- END PUT ---

// --- QUERY ---
router.get('/drafts', asyncHandler(ProductController.findAllDraftsForShop))
router.get('/published', asyncHandler(ProductController.findAllPublishedForShop))
// --- END QUERY ---

module.exports = router