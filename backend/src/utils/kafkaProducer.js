import { Kafka, Partitioners } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'nextGen-HR-backend', // Customize your client ID
  brokers: ['kafka:9092'] // Update with your Kafka broker(s)
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

/**
 * Initializes the Kafka producer connection.
 */
export async function initProducer() {
  try {
    await producer.connect();
  } catch (error) {
    console.error('Error connecting Kafka producer:', error);
    throw error;
  }
}

/**
 * Sends a message to a given Kafka topic.
 * @param {string} topic - The Kafka topic.
 * @param {string} message - The message payload.
 */
export async function sendUrlToKafka(topic, message) {
  try {
    console.log(`Sending message to Kafka topic ${topic}: ${message}`);
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
  } catch (error) {
    console.error('Error sending message to Kafka:', error);
    throw error;
  }
}
