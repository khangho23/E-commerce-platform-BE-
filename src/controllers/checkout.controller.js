'use strict'

const { CREATED, OK } = require('../cores/success.response')

// SERVICES
const CheckoutService = require('../services/checkout.service')

class CheckoutController {
    checkoutPreview = async (req, res) => {
        const { cart, user, shopOrderIds } = req.body

        new OK({
            message: 'Product added to cart!',
            metadata: await CheckoutService.checkoutPreview({
                cart, user, shopOrderIds
            })
        }).send(res)
    }
}

module.exports = new CheckoutController()