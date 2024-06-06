'use strict'

const { findCart, createUserCart, updateUserCartQuantity } = require('../repositories/cart.repository')
const { BadRequestError, NotFoundError } = require('../utils/errors')

class CartService {
    static async addToCart({ user, product = {} }) {
        // Check the product in the cart is exist
        const userCart = findCart({ user })

        // Create a new cart if the cart is not exist
        if (!userCart)
            return await createUserCart({ user, product })

        // Check the product is already in the cart
        if (userCart.products.length) {
            userCart.products = [product]
            return await userCart.save()
        }

        // If the product is not in the cart, increment the quantity
        return await updateUserCartQuantity({ user, product })
    }
}

module.exports = CartService