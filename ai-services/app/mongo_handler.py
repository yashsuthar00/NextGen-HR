from pymongo import MongoClient

# Initialize MongoDB client - update connection string if necessary
client = MongoClient('mongodb://mongodb:27017/')
db = client['nextgen_hr']
collection = db['resumes']

def store_resume_data(file_url, extracted_text):
    """
    Stores the resume data in MongoDB.
    
    Args:
        file_url (str): The signed URL of the uploaded resume.
        extracted_text (str): The text extracted from the resume.
    
    Returns:
        The inserted document's ID.
    """
    data = {
        "file_url": file_url,
        "extracted_text": extracted_text
    }
    result = collection.insert_one(data)
    return result.inserted_id
