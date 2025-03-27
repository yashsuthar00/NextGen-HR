import pika
import json

def start_consumer():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()

    queue_name = 'new_job_application_queue'  # Use the new queue name
    channel.queue_declare(queue=queue_name, durable=False)  # Ensure durable matches

    def callback(ch, method, properties, body):
        message = json.loads(body)
        print(f"Received message: {message}")
        # Process the message (e.g., save to database, trigger AI service, etc.)

    channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
    print(f"Waiting for messages in queue: {queue_name}")
    channel.start_consuming()
