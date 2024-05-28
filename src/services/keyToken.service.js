'use strict'

const keyTokenModel = require('../models/keyToken.model')
const {Types} = require('mongoose')

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = {user: userId}, update = {publicKey, privateKey, refreshTokensUsed: [], refreshToken}, 
            options = {upsert: true, new: true}

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            console.error(error)
            return error
        }
    }
    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({user: Types.ObjectId(userId)}).lean()
    }
    static removekeyById = async (id) => {
        return await keyTokenModel.remove(id)
    }
}

module.exports = KeyTokenService