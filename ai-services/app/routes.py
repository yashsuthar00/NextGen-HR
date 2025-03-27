from flask import Blueprint, current_app, jsonify
from bson.objectid import ObjectId  # Import ObjectId for MongoDB queries

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return jsonify({"message": "Welcome to the AI Services API!"})