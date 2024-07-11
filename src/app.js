require('dotenv').config()
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const express = require('express')
const compression = require('compression')
const httpStatus = require('http-status-codes')
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

const app = express()

// console.log(`Process::`, process.env)
// Init middlewares
app.use(express.json()); // Handling JSON
app.use(express.urlencoded({ extended: true })); // Handling url-encoded
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// test pub sub redis
require('./tests/inventory.test')
const productTest = require('./tests/product.test')
productTest.purchaseProduct('product:001', 10)

// Init database
require('./dbs/init.mongodb')
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

// Init routes
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument)) // Swagger document
app.use(require('./routes'))

// Handling error
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = httpStatus.NOT_FOUND
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || httpStatus.INTERNAL_SERVER_ERROR
    console.error('Stack tracing:', error.stack)
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal server error'
    })
})

module.exports = app