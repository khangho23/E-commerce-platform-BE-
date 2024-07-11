const RedisPubSubService = require('../services/redisPubSub.service')

class InventoryServiceTest {
    constructor() {
        RedisPubSubService.subscribe('purchase_events', (channel, message) => {
            console.log(`Received message ${message} from channel ${channel}`)
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory({ productId, quantity }) {
        console.log(`Updating inventory for product ${productId} with quantity ${quantity}`)
    }
}

module.exports = new InventoryServiceTest()