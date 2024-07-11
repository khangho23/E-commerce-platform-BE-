'use strict'

const status = Object.freeze({
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPED: 'shipped',
    CANCELLED: 'cancelled',
    DELIVERED: 'delivered'
})

module.exports = {
    status
}