'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../cores/error.response')

// SERVICE
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (error, decode) => {
            if (error)
                console.error(`Error verify::`, error)
            else
                console.error(`Decode verify::`, decode)
        })

        return { accessToken, refreshToken }
    } catch (error) {
        console.error(error)
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1. Check userId missing
        2. Get accessToken
        3. Verify token
        4. Check user in database
        5. Check keyStore with the userId
        6. Success => return next()
    */

    // Step 1
    const userId = req.headers[HEADER.CLIENT_ID]

    console.log(userId);

    if (!userId) throw new AuthFailureError('Missing userId')

    // Step 2
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError('User not found')

    // Step 3
    const accessToken = req.headers[HEADER.AUTHORIZATION]

    try {
        const decode = await JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decode.userId) throw new AuthFailureError('Invalid token')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = (token, keySecret) => {
    return JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}