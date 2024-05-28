'use strict'

require('dotenv').config()

const config = {
    developer: {
        app: {
            port: process.env.DEV_APP_PORT || 8000
        },
        db: {
            host: process.env.DEV_DB_HOST || 'localhost',
            port: process.env.DEV_DB_PORT || 27017,
            name: process.env.DEV_DB_NAME || 'shopDEV'
        }
    },
    
    production: {
        app: {
            port: process.env.PRO_APP_PORT || 8080
        },
        db: {
            host: process.env.PRO_DB_HOST || 'localhost',
            port: process.env.PRO_DB_PORT || 27017,
            name: process.env.PRO_DB_NAME || 'shopPRO'
        }
    }
}

const env = process.env.NODE_ENV || 'developer'
module.exports = config[env]