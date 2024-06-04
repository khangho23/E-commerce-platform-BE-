'use strict'

const ProductService = require('../services/product.service')
const { OK, CREATED } = require('../cores/success.response')

class ProductController {
    // --- POST ---
    // Create a product
    createProduct = async (req, res, next) => {
        new CREATED({
            message: 'Product created successfully',
            metadata: await ProductService.createProduct(req.body.category, {
                ...req.body,
                shop: req.keyStore.user
            })
        }).send(res)
    }
    // --- END POST ---

    // --- PATCH ---
    updateProduct = async (req, res, next) => {
        const { shop } = req.keyStore.user
        const { productId } = req.params

        new OK({
            message: 'Product updated successfully',
            metadata: await ProductService.updateProduct(req.body.category, productId, { ...req.body, shop })
        }).send(res)
    }
    // --- END PATCH ---

    // --- PUT ---
    // Publish a product by shop
    publishProductByShop = async (req, res, next) => {
        const { shop } = req.keyStore.user
        const { productId } = req.params

        new OK({
            message: 'Product published successfully',
            metadata: await ProductService.publishProductByShop({ shop, productId })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        const { shop } = req.keyStore.user
        const { productId } = req.params

        new OK({
            message: 'Product published successfully',
            metadata: await ProductService.unPublishProductByShop({ shop, productId })
        }).send(res)
    }
    // --- END PUT ---

    // --- QUERY ---
    // Get all draft products for a shop
    findAllDraftsForShop = async (req, res, next) => {
        new OK({
            message: 'Draft products retrieved successfully',
            metadata: await ProductService.findAllDraftsForShop(req.user.userId)
        }).send(res)
    }

    // Get all published products for a shop
    findAllPublishedForShop = async (req, res, next) => {
        new OK({
            message: 'Published products retrieved successfully',
            metadata: await ProductService.findAllPublishedForShop(req.user.userId)
        }).send(res)
    }

    searchProductsByUser = async (req, res, next) => {
        const { keySearch } = req.query

        new OK({
            message: 'Products retrieved successfully',
            metadata: await ProductService.searchProductsByUser({ keySearch })
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new OK({
            message: 'Products retrieved successfully',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        const { productId } = req.params

        new OK({
            message: 'Product retrieved successfully',
            metadata: await ProductService.findProduct({ productId })
        }).send(res)
    }
    // --- END QUERY ---
}

module.exports = new ProductController()