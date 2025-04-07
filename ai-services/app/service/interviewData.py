from app import app
from bson.objectid import ObjectId

def fetch_interview_data(id):
    mongo_instance = app.config['MONGO']

    try:
        # Convert the string ID to ObjectId
        object_id = ObjectId(id)
        
        # Fetch the application document with the given ObjectId
        interview_document = mongo_instance.db.interviews.find_one({"_id": object_id})
        
        if not interview_document:
            return "No data found for the given ID"
        
        return interview_document

        # # Fetch the job document using the jobId reference
        # job_id = interview_document.get("jobId")
        # if job_id:
        #     job_document = mongo_instance.db.jobs.find_one({"_id": ObjectId(job_id)})
        #     interview_document["jobDetails"] = job_document
        
    except Exception as e:
        return f"An error occurred: {e}"
    