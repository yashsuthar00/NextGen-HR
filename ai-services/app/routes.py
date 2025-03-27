from flask import Blueprint, current_app, jsonify

main = Blueprint('main', __name__)

app = current_app

@main.route('/')
def index():
    # Retrieve the database object from the PyMongo instance
    db = app.config['MONGO_DB']  # Use the actual database object
    print(f"Database name in route: {db.name}")  # Print the database name
    collection = db["applications"]  # Access the collection
    # Example: Fetch all documents from the collection
    data = list(collection.find())
    return jsonify(data)  # Convert data to string for display
