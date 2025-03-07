from app import create_app
from app.kafka_consumer import start_consumer
import threading

app = create_app()

if __name__ == '__main__':
    # Start the Kafka consumer in a separate daemon thread
    consumer_thread = threading.Thread(target=start_consumer, daemon=True)
    consumer_thread.start()
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
