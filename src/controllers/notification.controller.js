'use strict'

const NotificationService = require('../services/notification.service')
const { OK } = require('../cores/success.response')

class NotificationController {
    findNotificationsByReceived = async (req, res) => {
        const { receivedId, type } = req.query

        new OK({
            message: 'Get notifications successfully!',
            metadata: await NotificationService.findNotificationsByReceived({ receivedId, type })
        }).send(res)
    }
}

module.exports = new NotificationController