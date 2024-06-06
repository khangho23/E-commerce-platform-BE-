'use strict'

const ApiKeyService = require("../services/apiKey.service")
const {HEADER} = require('../commons/constants')

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        
        if (!key)
            return res.json({
                message: 'Forbidden'
            })

        // Check objKey
        const objKey = await ApiKeyService.findById(key)
        if (!objKey)
            return res.status(403).json({
                message: "Forbidden error"
            })

        req.objKey = objKey

        return next()
    } catch (error) {
        console.error(error)
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        const permissionObjKey = req.objKey?.permissions
        console.log(permissionObjKey);
        if (!permissionObjKey)
            return res.status(403).json({
                message: 'Permission denied'
            })

        console.log('Permission::', permissionObjKey)
        const validPermission = permissionObjKey.includes(permission)

        if (!validPermission)
            return res.status(403).json({
                message: 'Permission denied'
            })

        return next()
    }
}

module.exports = {
    apiKey,
    permission
}