'use strict'

const keyTokenModel = require('../models/keyToken.model')
const {Types} = require('mongoose')

class KeyTokenService {
    /**
     * @description Create key token
     * @param {Object} param0
     * @param {string} param0.userId
     * @param {string} param0.publicKey
     * @param {string} param0.privateKey
     * @param {string} param0.refreshToken 
     * @returns 
     * @throws {Error}
     */
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

    /**
     * @description Find by user id
     * @param {*} userId 
     * @returns 
     * @throws {Error}
     */
    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({user: new Types.ObjectId(userId)}).lean()
    }

    /**
     * @decription Remove key by id
     * @param {*} id 
     * @returns 
     * @throws {Error}
     */
    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne(id)
    }

    /**
     * @description Find by refresh token used
     * @param {string} refreshToken 
     * @returns 
     * @throws {Error}
     */
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }

    /**
     * @description Delete by user id
     * @param {string} userId 
     * @returns 
     * @throws {Error}
     */
    static deleteKeyById = async (userId) => {
        return await keyTokenModel.findOneAndDelete({user: userId})
    }

    /**
     * @description Find by refresh token
     * @param {string} refreshToken 
     * @returns 
     * @throws {Error}
     */
    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshToken}).lean()
    }

    /**
     * @decritpion Update refresh token by id
     * @param {string} tokenHolderIdDoc 
     * @param {string} refreshToken 
     * @param {Array} refreshTokenUsed 
     * @returns 
     * @throws {Error}
     */
    static updateRefreshTokenById = async (tokenHolderIdDoc, refreshToken, refreshTokenUsed) => {
        return await keyTokenModel.updateOne(
            { _id: tokenHolderIdDoc },
            {
                $set: { refreshToken },
                $addToSet: {
                    refreshTokensUsed: refreshTokenUsed // Old refresh token
                }
            }
        )
    }
}

module.exports = KeyTokenService