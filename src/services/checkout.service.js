'use strict'

const { NotFoundError } = require('../cores/error.response')

const { getDiscountAmout } = require("../services/discount.service")

const { findCartById } = require("../repositories/cart.repository")
const { checkProductByServer } = require("../repositories/product.repository")

class CheckoutService {
    static async checkoutPreview({
        cart, user, shopOrderIds
    }) {
        const foundCart = await findCartById(cart)
        if (!foundCart)
            throw new NotFoundError('Cart not found')

        const checkoutOrder = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shopOrderIdsNew = []

        for (let i = 0; i < shopOrderIds.length; i++) {
            const { shop, discounts = [], products = [] } = shopOrderIds[i]
            
            const checkProductServer = await checkProductByServer(products)
            if (!checkProductServer[0])
                throw new NotFoundError('Product not found')
            
            // Calculate total price
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + product.price * product.quantity
            }, 0)

            // Total price previous has been calculated
            checkoutOrder.totalPrice += checkoutPrice

            const itemCheckout = {
                shop,
                discounts,
                priceRaw: checkoutPrice, // Price before discount
                priceApplyDiscount: checkoutPrice, // Price after discount
                products: checkProductServer
            }

            // Calculate total discount if it's available
            if (discounts.length > 0) {
                // Just have one discount
                // Get the amount of discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmout({
                    code: discounts[0].code,
                    user,
                    shop,
                    products: checkProductServer
                })

                // Total discount has been calculated
                checkoutOrder.totalDiscount += discount

                // If discount > 0, apply discount to price
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // Total checkout price
            checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount
            shopOrderIdsNew.push(itemCheckout)
        }

        return {
            shopOrderIds,
            shopOrderIdsNew,
            checkoutOrder
        }
    }
}

module.exports = CheckoutService