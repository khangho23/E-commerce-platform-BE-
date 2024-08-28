'use strict'

// MODELS
const { notification } = require('../models/notification.model')

// ENUMS
const { state } = require('../enums/notification.enum')

// --- SELECT ---
const findNotificationsByReceived = async ({
    receivedId,
    type
}) => {
    return await notification.aggregate([
        {
            $match: {
                receivedId: Number(receivedId),
                type
            }
        },
        {
            $project: {
                type: 1,
                receivedId: 1,
                senderId: 1,
                content: 1,
                createdAt: 1,
                options: 1
            }
        }
    ]);
}
// --- END SELECT ---

// --- CREATE ---
const create = async ({
    type = state.ORDER_SUCCESSFULLY,
    receivedId = 1,
    senderId = 1,
    content = '',
    options = {}
}) => {
    const newNotification = new notification({
        type,
        receivedId,
        senderId,
        content,
        options
    })

    return newNotification.save()
}
// --- END CREATE ---

module.exports = {
    findNotificationsByReceived,
    create
}