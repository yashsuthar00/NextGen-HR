import os
from dotenv import load_dotenv
from flask import Flask
from app.utils.env_validator import validate_env_variables  # Import the validator

def configure_app(app: Flask):
    load_dotenv()

    # Validate required environment variables
    validate_env_variables(["SECRET_KEY", "MONGO_URI"])

    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    app.config['MONGO_URI'] = os.getenv("MONGO_URI")
