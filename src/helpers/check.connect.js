'use strict'

const mongoose = require('mongoose')
const os = require('os')
const proccess = require('process')

const _SECONDS = 5000

const countConnect = () => {
    const numConnection = mongoose.connection.length
    console.log(`Number of connection: ${numConnection}`)
}

const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connection.length
        const numCores = os.cpus().length
        const memoryUsage = proccess.memoryUsage().rss

        // The maximum number of connections is determined by the number of OSF cores
        const maxConnection = numCores * 5

        console.log(`Active connection: ${numConnection}`)
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`)

        if (numConnection > maxConnection) {
            console.log(`Connnection overload detected!`)
            // notify.send(...)
        }
    }, _SECONDS) // // Monitoring every 5 seconds
}

module.exports = { countConnect, checkOverload }