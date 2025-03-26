import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    MONGO_URI = os.getenv("MONGO_URI")

    # Validate required environment variables
    if not SECRET_KEY:
        raise EnvironmentError("Error: SECRET_KEY is not set in the .env file.")
    if not MONGO_URI:
        raise EnvironmentError("Error: MONGO_URI is not set in the .env file.")
