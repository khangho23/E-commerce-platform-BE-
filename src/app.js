require('dotenv').config()
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const express = require('express')
const compression = require('compression')
const httpStatus = require('http-status-codes')

const app = express()

// console.log(`Process::`, process.env)
// Init middlewares
app.use(express.json()); // Handling JSON
app.use(express.urlencoded({ extended: true })); // Handling url-encoded
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// Init database
require('./dbs/init.mongodb')
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

// Init routes
app.use(require('./routes'))

// Handling error
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = httpStatus.NOT_FOUND
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || httpStatus.INTERNAL_SERVER_ERROR
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal server error'
    })
})

module.exports = app