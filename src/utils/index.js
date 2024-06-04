'use strict'

const _ = require('lodash')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const getSelectedData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectedData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeNullOrUndefinedObj = obj => {
    Object.keys(obj).forEach(
        key => {
            if (obj[key] === null || obj[key] === undefined)
                delete obj[key]
        }
    )

    return obj
}

const updateNestedObjParser = obj => {
    let updatedObj = {}

    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            if (obj[key] === null || obj[key] === undefined)
                return

            const response = updateNestedObjParser(obj[key])
            if (response)
                Object.keys(response).forEach(subKey => {
                    updatedObj[`${key}.${subKey}`] = response[subKey];
                })

        } else
            if (obj[key] !== null && obj[key] !== undefined)
                updatedObj[key] = obj[key]
    })

    return updatedObj
}

module.exports = {
    getInfoData,
    getSelectedData,
    unGetSelectedData,
    removeNullOrUndefinedObj,
    updateNestedObjParser
}