'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const { ROUTING } = require('../commons/constants')

const router = express.Router()

const API_VERSION_ONE = `${ROUTING.V1}${ROUTING.API}`

// Check API key
router.use(apiKey)

// Check permission
router.use(permission('0000'))

router.use(`${API_VERSION_ONE}${ROUTING.PRODUCT}`, require('./product'))
router.use(`${API_VERSION_ONE}${ROUTING.DISCOUNT}`, require('./discount'))
router.use(`${API_VERSION_ONE}`, require('./access'))

module.exports = router