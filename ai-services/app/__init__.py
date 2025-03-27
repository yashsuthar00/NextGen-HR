from flask import Flask
from .routes import main
from .config import configure_app
from flask_pymongo import PyMongo  # Import PyMongo
from urllib.parse import urlparse

mongo = PyMongo()  # Create a PyMongo instance

def create_app():
    app = Flask(__name__)
    configure_app(app)

    app.register_blueprint(main)

    # Initialize PyMongo with the app
    mongo.init_app(app)

    app.config['MONGO'] = mongo
    app.config['MONGO_DB'] = mongo.db
    app.config['MONGO_DB_NAME'] = mongo.db.name

    # Verify the database name
    if mongo.db.name:
        print(f"Database connected successfully: {mongo.db.name}")
    else:
        print("Failed to retrieve the database name!")

    return app
