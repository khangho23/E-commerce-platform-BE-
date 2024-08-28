const amqp = require('amqplib');

const messages = 'Hello RabbitMQ'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:123456@localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue('test_queue', {
            durable: true
        });
        
        await channel.sendToQueue('test_queue', Buffer.from(messages));
        console.log(`Producer sent ${messages}`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error(error);
    }
}

runProducer().catch(console.error);