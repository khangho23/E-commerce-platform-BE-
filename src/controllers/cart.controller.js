'use strict'

const { CREATED, OK } = require('../cores/success.response')

// SERVICES
const CartService = require('../services/cart.service')

class CartController {
    addToCart = async (req, res, next) => {
        new CREATED({
            message: 'Product added to cart!',
            metadata: await CartService.addToCart({
                ...req.body,
                user: req.user.userId
            })
        }).send(res)
    }

    updateCart = async (req, res, next) => {
        new OK({
            message: 'Cart updated!',
            metadata: await CartService.updateCart({
                ...req.body,
                user: req.user.userId
            })
        }).send(res)
    }

    deleteProductFromCart = async (req, res, next) => {
        new OK({
            message: 'Cart deleted!',
            metadata: await CartService.deleteProductFromCart({
                ...req.body,
                user: req.user.userId
            })
        }).send(res)
    }

    getCartByUserId = async (req, res, next) => {
        new OK({
            message: 'Cart fetched!',
            metadata: await CartService.getCartByUserId({
                user: req.user.userId
            })
        }).send(res)
    }
}

module.exports = new CartController()