import os
from dotenv import load_dotenv
from flask import Flask
from app.utils.env_validator import validate_env_variables  # Import the validator

def configure_app(app: Flask):
    load_dotenv()

    # Validate required environment variables
    validate_env_variables(["SECRET_KEY", "MONGO_URI", "GROQ_API_KEY", "GOOGLE_APPLICATION_CREDENTIALS"])

    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    app.config['MONGO_URI'] = os.getenv("MONGO_URI")
    app.config['GROQ_API_KEY'] = os.getenv("GROQ_API_KEY")  
    app.config['GOOGLE_APPLICATION_CREDENTIALS'] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")