import pika
import json
import re
from flask import current_app
from app.service.resume import process_resume, async_detect_text_in_pdf, summarize_resume, ats_scanner  
from app.service.questionsGenerator import generate_interview_questions, split_questions, ensure_question_marks, process_questions
from app.service.applicationData import fetch_application_data
from app import app  

SERVICE_ACCOUNT_JSON = r"./../env/nextgen-hr-8ce4fa070811.json"
GCS_DESTINATION_URI = "gs://bucket_nextgen-hr/vision_output/"

def start_consumer():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()

    queue_name = 'new_job_application_queue'  # Use the new queue name
    channel.queue_declare(queue=queue_name, durable=False)  # Ensure durable matches

    def callback(ch, method, properties, body):
        message = json.loads(body)
        print(f"Received message: {message}")
        
        document = fetch_application_data(message)
        print("\n fetched application document",document)

        print("\n the resume url from the document:", document['resumeURL'])
        
        # Extract the resumeURL from the message
        resume_url = document['resumeURL']
        if resume_url:
            # Call the function in resume.py with the resumeURL
            print(f"Extracted resumeURL: {resume_url}")
            process_resume(resume_url)
            
            #function to extract text from pdf file
            resume_text = async_detect_text_in_pdf(SERVICE_ACCOUNT_JSON, resume_url, GCS_DESTINATION_URI)
            print("\nResume text extracted successfully:\n" , resume_text )
            # print(resume_text)

            # function to convert pdf text into resume summmay text
            print("\n resume summary generating .....")
            resume_summary = summarize_resume(resume_text)
            print("\n resume summary generated successfully:\n" , resume_summary)

            print("\n ats report generating process started ...")
            job_desciption = document['jobDetails']['description']
            print("\n job description from the document:", job_desciption)
            ats_report = ats_scanner(resume_summary, job_desciption)
            print("\n ats report generated successfully:")
            print(ats_report)

            # print("\nATS Report:\n", ats_report)

            match = re.search(r"Score:\s*[\r\n]*\s*(\d+)%", ats_report)
            print(match)
            print("\n ATS report score will be generated soon...")
            # If a match is found, print the score
            if match:
                score = match.group(1)
                print("\nThe score is:", score)
            else:
                print("No score found.")
            print("\n genearting questions ....")
            questions = generate_interview_questions(resume_summary, job_desciption)
            print(questions)

            # print("\n splitting questions ....")
            # questions_array = split_questions(questions)
            # print(questions_array)

            # print("\n genearting questions with questions marks ....")
            # questions_with_marks = ensure_question_marks(questions_array)

            # print(questions_with_marks)

            print("processing questions ....")
            questions_array = process_questions(questions)
            print(questions_array)

            questionDocument = {
                "jobId": document['jobDetails']['_id'],
                "userId": document['userId'],
                "questions": questions_array,
            }

            # Fetch the MONGO instance from app.config
            mongo_instance = app.config['MONGO']
            print("MONGO instance in callback:", mongo_instance)

            # Example of using the MONGO instance
            result = mongo_instance.db.interviews.insert_one(questionDocument)
            print("Inserted question document with ID:", result.inserted_id)
            print("\n Question document inserted successfully:\n", questionDocument)


        else:
            print("resumeURL not found in the message")

    channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
    print(f"Waiting for messages in queue: {queue_name}")
    channel.start_consuming()