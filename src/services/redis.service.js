'use strict'

const redis = require('redis');
const { promisify } = require('util');
const redisClient = redis.createClient();

const { reservationInventory } = require('../repositories/inventory.repository');

// Sử dụng tên phương thức đúng theo phiên bản 3.x của redis
const pExpire = promisify(redisClient.pexpire).bind(redisClient);
const setNXAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (product, quantity, cart) => {
    const key = `lock_v2023:${product}`;
    const retryTimes = 10;
    const expireTime = 3000; // 3 seconds

    for (let i = 0; i < retryTimes; i++) {
        const result = await setNXAsync(key, expireTime);
        console.log('result::', result);
        if (result === 1) {
            // Lock acquired
            const isReservation = await reservationInventory({ product, quantity, cart });
            
            if (isReservation.modifiedCount) {
                await pExpire(key, expireTime);
                return key;
            }

            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
}

const releaseLock = async keyLock => {
    const delAsync = promisify(redisClient.del).bind(redisClient);
    return await delAsync(keyLock);
}

module.exports = {
    acquireLock,
    releaseLock
};
