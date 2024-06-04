'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require('../cores/error.response')
const ProductCategory = require('../enums/ProductCategory')
const {
    findAllDraftsForShop,
    findAllPublishedForShop,
    publishedProductByShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProduct,
    updateProductById
} = require('../repositories/product.respository')
const { removeNullOrUndefinedObj, updateNestedObjParser } = require('../utils')
const { insertInventory } = require('../repositories/inventory.repo')

// Define the factory class
class ProductFactory {
    /*
        category: String (ex: Clothing, Electronics, Furniture, ...)
    */
    static productRegistry = {}

    /**
     * @description Register a product category
     * @param {string} category 
     * @param {string} classReference 
     */
    static registerProductCategory(category, classReference) {
        this.productRegistry[category] = classReference
    }

    /**
     * @description Create a product
     * @param {string} category 
     * @param {string} payload 
     * @returns 
     */
    static async createProduct(category, payload) {
        const productClass = this.productRegistry[category]
        if (!productClass) throw new BadRequestError('Invalid product category')

        return new productClass(payload).createProduct()
    }

    /**
     * @description Update a product
     * @param {*} category 
     * @param {*} payload 
     * @returns 
     * @throws {Error}
     */
    static async updateProduct(category, productId, payload) {
        const productClass = this.productRegistry[category]
        if (!productClass) throw new BadRequestError('Invalid product category')

        return new productClass(payload).updateProduct(productId)
    }

    /**
     * @description Publish a product by shop
     * @param {string} shop
     * @param {string} productId
     * @returns
     * @throws {Error}
     */
    static async publishProductByShop({ shop, productId }) {
        return await publishedProductByShop({ shop, productId })
    }

    /**
     * @description Publish a product by shop
     * @param {string} shop
     * @param {string} productId
     * @returns
     * @throws {Error}
     */
    static async unPublishProductByShop({ shop, productId }) {
        return await unPublishProductByShop({ shop, productId })
    }

    /**
     * @description Get all draft products for a shop
     * @param {string} shop 
     * @param {number} limit 
     * @param {number} skip
     * @returns
     * @throws {Error}
     */
    static async findAllDraftsForShop(shop, limit = 50, skip = 0) {
        const query = { shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    /**
     * @description Get all published products for a shop
     * @param {string} shop 
     * @param {number} limit 
     * @param {number} skip 
     * @returns 
     */
    static async findAllPublishedForShop(shop, limit = 50, skip = 0) {
        const query = { shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }

    /**
     * @description Search products
     * @param
     * @param {string} keySearch 
     * @returns 
     */
    static async searchProductsByUser({ keySearch }) {
        return await searchProductsByUser({ keySearch })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isDraft: false, isPublished: true } }) {
        return await findAllProducts({
            limit,
            sort,
            page,
            filter,
            select: ['name', 'thumb', 'description', 'price', 'quantity', 'category', 'shop', 'attributes']
        })
    }

    static async findProduct({ productId }) {
        return await findProduct({ productId, unSelect: ['isDraft', 'isPublished', '__v'] })
    }
}

class Product {
    constructor({ name, thumb, description, price, quantity, category, shop, attributes }) {
        this.name = name
        this.thumb = thumb
        this.description = description
        this.price = price
        this.quantity = quantity
        this.category = category
        this.shop = shop
        this.attributes = attributes
    }

    // Create new product
    async createProduct(productId) {
        const newProduct = await product.create({ ...this, _id: productId })
        if (newProduct) {
            // Add product to shop inventory
            await insertInventory({ shop: this.shop, product: productId, stock: this.quantity })
        }

        return newProduct
    }

    // Update product
    async updateProduct(productId, payload) {
        return await updateProductById({ productId, payload: updateNestedObjParser(payload), model: product })
    }
}

// Define sub-classes for different product categories Clothing and Electronics
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.attributes)
        if (!newClothing) throw new BadRequestError('Failed to create new clothing')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('Failed to create new product')

        return newProduct
    }

    async updateProduct(productId) {
        /**
         * payload:{
         *  a: undefined,
         *  b: null,
         * }
         * => remove attribute is null or undefined
         */

        // const payload = 

        if (payload.attributes) {
            await updateProductById({ productId, payload, model: clothing })
        }

        const updateProduct = await super.updateProduct(productId, payload)
        return updateProduct
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.attributes,
            shop: this.shop
        })
        if (!newElectronic) throw new BadRequestError('Failed to create new electronic')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('Failed to create new product')

        return newProduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.attributes,
            shop: this.shop
        })
        if (!newFurniture) throw new BadRequestError('Failed to create new electronic')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Failed to create new product')

        return newProduct
    }

    async updateProduct(productId) {
        /**
         * payload:{
         *  a: undefined,
         *  b: null,
         * }
         * => remove attribute is null or undefined
         */

        const payload = removeNullOrUndefinedObj(this)

        if (payload.attributes) {
            await updateProductById({
                productId,
                payload: updateNestedObjParser(payload.attributes),
                model: furniture
            })
        }

        const updateProduct = await super.updateProduct(productId, payload)
        return updateProduct
    }
}

ProductFactory.registerProductCategory(ProductCategory.CLOTHING, Clothing)
ProductFactory.registerProductCategory(ProductCategory.ELECTRONICS, Electronics)
ProductFactory.registerProductCategory(ProductCategory.FURNITURE, Furniture)

module.exports = ProductFactory