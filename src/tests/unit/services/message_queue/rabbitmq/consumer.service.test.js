const amqp = require('amqplib');

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:123456@localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue('test_queue', {
            durable: true
        });
        await channel.consume('test_queue', (message) => {
            console.log(`Consumer received ${message.content.toString()}`);
        }, {
            noAck: true
        });
    } catch (error) {
        console.error(error);
    }
}

runConsumer().catch(console.error);