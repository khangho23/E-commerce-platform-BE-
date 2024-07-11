const Redis = require('redis');

class RedisPubSubService {
    constructor() {
        this.subscriber = Redis.createClient(); // Đổi tên để tránh trùng lặp với phương thức
        this.publisher = Redis.createClient();
    }

    publish(channel, message) { // Đổi tên phương thức cho đúng với chức năng
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    subscribe(channel, callback) { // Đổi tên phương thức cho đúng với chức năng
        this.subscriber.subscribe(channel); // Sửa lỗi sai tên phương thức
        this.subscriber.on('message', (receivedChannel, message) => {
            if (receivedChannel === channel) {
                const parsedMessage = JSON.parse(message);
                callback(channel, parsedMessage);
            }
        });
    }
}

module.exports = new RedisPubSubService();