const amqp = require('amqplib');

const messages = 'A new product has been added';

const log = console.log;

console.log = function() {
    log.apply(console, [new Date().toISOString(), ...arguments]);
}

const runProducerDLX = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:123456@localhost');
        const channel = await connection.createChannel();

        const notificationExchange = 'notification_exchange';
        const notificationQueue = 'notification_queue';
        const notificationDLX = 'notification_dlx';
        const notificationRoutingKey = 'notification_key';

        // Declare Exchange DLX
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true // The exchange will survive broker restarts
        });

        // Declare Queue DLX
        const queueResult = await channel.assertQueue(notificationQueue, {
            exclusive: false, // Allow multiple consumers to consume from the same queue
            durable: true,
            deadLetterExchange: notificationDLX,
            deadLetterRoutingKey: notificationRoutingKey
        });

        // Bind Queue DLX
        await channel.bindQueue(queueResult.queue, notificationExchange);

        // Send message
        console.log(`[x] Sending message: ${messages}`);
        await channel.sendToQueue(queueResult.queue, Buffer.from(messages), {
            expiration: '10000' // 10 seconds
        });

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error(error);
    }
}

runProducerDLX().catch(console.error);