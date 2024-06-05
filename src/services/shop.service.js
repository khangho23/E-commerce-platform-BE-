'use strict'

const { findByEmail } = require('../repositories/shop.repository')

class ShopService {
    /**
     * @description Find by email
     * @param {Object} param0
     * @param {string} param0.email
     * @returns
     * @throws {Error}
     */
    static async findByEmail({ email }) {
        return await findByEmail({ email })
    }
}

module.exports = ShopService