'use strict'

const { NotFoundError } = require('../cores/error.response')

const { increaseStock } = require('../repositories/inventory.repository')
const { getProductById } = require('../repositories/product.repository')

class InventoryService {
    static async addStockToInventory({
        stock, product, quantity, shop,
        location = 'District 2, Thao Dien, HCMC, Vietnam'
    }) {
        const productModel = await getProductById(product)
        if (!productModel)
            throw new NotFoundError('Product not found')

        // Add stock to inventory
        return await increaseStock({
            stock, product, quantity, shop, location
        })
    }
}

module.exports = InventoryService