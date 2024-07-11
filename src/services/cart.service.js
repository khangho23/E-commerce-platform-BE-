'use strict'

const { BadRequestError, NotFoundError } = require('../cores/error.response')

// REPOSITORIES
const {
    findCart,
    createUserCart,
    updateUserCartQuantity,
    getCartByUserId,
    deleteProductFromCart
} = require('../repositories/cart.repository')
const { getProductById, findProductSelectedFields } = require('../repositories/product.repository')

class CartService {
    /**
     * @description Add a product to the cart
     * @param {Object} param0
     * @param {String} param0.user
     * @param {Object} param0.product 
     * @returns 
     * @throws {Error}
     */
    static async addToCart({ user, productId, quantity }) {
        // Check the product in the cart is exist
        const userCart = await findCart({ user })

        // Check the product is exist
        const productInfo = await findProductSelectedFields({
            productId,
            select: ['_id', 'name', 'price', 'shop', 'attributes']
        })
        if (!productInfo)
            throw new NotFoundError('Product not found')

        // Create a new cart if the cart is not exist
        if (!userCart)
            return await createUserCart({ user, product: { ...productInfo, quantity } })

        console.log(!userCart.products.length, 'userCart.products.length');
        // Check the product is already in the cart
        if (userCart.products?.length === 0) {
            userCart.products = [product]
            return await userCart.save()
        }

        // If the product is not in the cart, increment the quantity
        return await updateUserCartQuantity({ user, product })
    }

    // TODO
    static async updateCart({ user, shopOrderIds = [] }) {
        const { _id, quantity, oldQuantity } = shopOrderIds[0]?.itemProducts[0]

        const foundProduct = await getProductById(_id)
        if (!foundProduct)
            throw new NotFoundError('Product not found')

        if (foundProduct.shop.toString() !== shopOrderIds[0]?.shopId)
            throw new NotFoundError('Product not found in the shop')

        if (quantity === 0) {

        }

        return await updateUserCartQuantity({
            user,
            product: {
                _id,
                quantity: quantity - oldQuantity
            }
        })
    }

    // TODO
    static async getCartByUserId({ user }) {
        const { products } = await getCartByUserId({ user })

        if (products.length === 0)
            throw new NotFoundError('Cart is empty')

        const productIds = products.map(({ _id }) => _id) || []

        if (productIds.length === 0)
            throw new BadRequestError('Product not found')

        const productInfo = await getProductByIds(productIds)

        return await getCartByUserId({ user })
    }

    static async deleteProductFromCart({ user, productId }) {
        return await deleteProductFromCart({ user, productId })
    }
}

module.exports = CartService