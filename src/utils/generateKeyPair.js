'use strict'

const crypto = require('crypto')

const BYTES = 64 // bytes
const RADIX = 'hex' // hexadecimal

const generateKeyPairSync = (bytes = BYTES, radix = RADIX) => {
    const privateKey = crypto.randomBytes(bytes).toString(radix)
    const publicKey = crypto.randomBytes(bytes).toString(radix)

    return { privateKey, publicKey }
}

module.exports = { generateKeyPairSync }