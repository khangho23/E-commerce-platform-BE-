'use strict'

const { OK, CREATED } = require('../cores/success.response')

const InventoryService = require('../services/inventory.service')

class InventoryController {
    // --- POST ---
    addStockToInventory = async (req, res) => {
        new CREATED({
            message: 'Stock has been added to inventory successfully',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
    // --- END POST ---
}

module.exports = new InventoryController()