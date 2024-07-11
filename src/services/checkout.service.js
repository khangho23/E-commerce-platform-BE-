'use strict'

const { NotFoundError } = require('../cores/error.response')

const DiscountService = require("../services/discount.service")
const {acquireLock, releaseLock} = require("../services/redis.service")

const { findCartById } = require("../repositories/cart.repository")
const { checkProductByServer } = require("../repositories/product.repository")
const { create } = require("../repositories/order.repository")

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
                const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmout({
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

    static async orderByUser({
        shopOrderIds,
        cart,
        user,
        userAddress = {},
        userPayment = {}
    }) {
        const { shopOrderIdsNew, checkoutOrder } = await CheckoutService.checkoutPreview({
            cart,
            user,
            shopOrderIds
        })

        // Check if packages are exceeded the inventory of the shop
        const products = shopOrderIdsNew.flatMap(shopOrder => shopOrder.products)
        console.log(`[1]:`, products);

        const acquireProducts = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock(productId, quantity, cart)
            acquireProducts.push(keyLock ? true : false)

            if (keyLock)
                await releaseLock(keyLock)
        }

        // Check if all products are available
        if (acquireProducts.includes(false))
            throw new NotFoundError('Product is not available') 

        const newOrder = await create({
            user,
            checkout: checkoutOrder,
            shipping: userAddress,
            payment: userPayment,
            products: shopOrderIdsNew
        })

        if (newOrder) {
            // Remove cart
            // await removeCartById(cart)
        }

        return newOrder
    }

    static async getOrdersByUser({ user }) {
        
    }

    static async cancelOrderByUser({ user, orderId }) {
        
    }

    /**
     * [Shop | Admin]
     */
    static async updateOrderStatusByShop() {

    }
}

module.exports = CheckoutService