'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../auth/checkAuth')

const router = express.Router()

router.post('/shop/register', asyncHandler(accessController.register))

router.post('/shop/login', asyncHandler(accessController.login))

module.exports= router