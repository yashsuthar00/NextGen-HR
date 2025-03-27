import amqp from 'amqplib';

let channel, connection;

export async function connectRabbitMQ() {
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    console.log('RabbitMQ connected successfully');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
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
