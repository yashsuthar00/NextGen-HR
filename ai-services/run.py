from app import create_app
from app.rabbitmq_consumer import start_consumer
import threading

app = create_app()
app.app_context().push()

if __name__ == '__main__':
    # Run RabbitMQ consumer in a separate thread
    consumer_thread = threading.Thread(target=start_consumer, daemon=True)
    consumer_thread.start()

    app.run(host='0.0.0.0', port=5000, debug=True)