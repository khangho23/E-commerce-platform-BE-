'use strict'

const { findById } = require('../repositories/apiKey.repository')

class ApiKeyService {
    /**
     * 
     * @param {string} key 
     * @returns 
     * @throws {Error}
     */
    static findById = async (key) => {
        return await findById({ key })
    }
}

module.exports = ApiKeyService