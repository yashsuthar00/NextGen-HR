import os
from flask import jsonify, current_app
from bson.objectid import ObjectId

def get_application_data(id):
    """
    Retrieves application data from the MongoDB collection based on _id.
    """
    db = current_app.config['MONGO_DB'] 
    collection = db["applications"]
    
    try:
        # Fetch the document based on _id
        data = collection.find_one({"_id": ObjectId(id)})
        if data:
            return jsonify(data)  # Convert data to JSON for display
        else:
            return jsonify({"error": "Document not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
