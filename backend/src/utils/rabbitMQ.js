import amqp from 'amqplib';

let channel, connection;

export async function connectRabbitMQ() {
  try {
    connection = await amqp.connect({
      protocol: 'amqp',
      hostname: 'localhost',
      heartbeat: 10, // Enable heartbeats every 10 seconds
    });
    channel = await connection.createChannel();
    console.log('RabbitMQ connected successfully');

    // Handle connection close and errors
    connection.on('close', () => {
      console.error('RabbitMQ connection closed. Reconnecting...');
      setTimeout(connectRabbitMQ, 5000); // Reconnect after 5 seconds
    });

    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
    });
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    setTimeout(connectRabbitMQ, 5000); // Retry connection after 5 seconds
  }
}

export async function sendMessage(queue, message) {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }
    // Ensure the durable property matches the existing queue configuration
    await channel.assertQueue(queue, { durable: false }); // Set durable to false to match the existing queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Message sent to queue "${queue}":`, message);
  } catch (error) {
    console.error('Error sending message to RabbitMQ:', error);
  }
}

export async function closeRabbitMQ() {
  try {
    await channel.close();
    await connection.close();
    console.log('RabbitMQ connection closed');
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error);
  }
}
