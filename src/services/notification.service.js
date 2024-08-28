'use strict'

const { NotFoundError } = require('../cores/error.response')

// ENUMS
const { state } = require('../enums/notification.enum')

// SERVICES
const notificationRepository = require('../repositories/notification.repository')

// --- SELECT ---
const findNotificationsByReceived = async ({
    receivedId = 1,
    type = 'ALL',
    isRead = 0
}) => {
    const match = {
        receivedId
    }

    if (type !== 'ALL') match.type = type

    const notifications = await notificationRepository.findNotificationsByReceived(match)

    if (!notifications || notifications.length === 0)
        throw new NotFoundError('No notification found')

    return notifications
}
// --- END SELECT ---

// --- CREATE ---
const pushNotificationSystem = async ({
    type = state.ORDER_SUCCESSFULLY,
    receivedId = 1,
    senderId = 1,
    options = {}
}) => {
    // Call the push notification service
    let content

    if (type === state.ORDER_SUCCESSFULLY)
        content = `@@@ - @@@@ Your order has been successfully placed.`
    else if (type === state.ORDER_FAILED)
        content = `@@@ - @@@@ Your order has been failed.`
    else if (type === state.NEW_PROMOTION)
        content = `@@@ - @@@@ New promotion is available.`
    else if (type === state.NEW_PRODUCT_FOR_FOLLOWER)
        content = `@@@ - @@@@ New product is available for you.`

    const newNotification = await notificationRepository.create({
        type,
        receivedId,
        senderId,
        content,
        options
    })

    return newNotification
}
// --- END CREATE ---

module.exports = {
    findNotificationsByReceived,
    pushNotificationSystem
}