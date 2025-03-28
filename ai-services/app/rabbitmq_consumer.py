import pika
import json
import re
from flask import current_app
from app.service.resume import process_resume, async_detect_text_in_pdf, summarize_resume, ats_scanner  # Import the function to process the resume

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
        
        # Extract the resumeURL from the message
        resume_url = message.get('resumeURL')
        if resume_url:
            # Call the function in resume.py with the resumeURL
            print(f"Extracted resumeURL: {resume_url}")
            process_resume(resume_url)
            
            #function to extract text from pdf file
            resume_text = async_detect_text_in_pdf(SERVICE_ACCOUNT_JSON, resume_url, GCS_DESTINATION_URI)
            print("\nResume text extracted successfully.")
            # print(resume_text)

            # function to convert pdf text into resume summmay text
            print("\n resume summary generating .....")
            resume_summary = summarize_resume(resume_text)
            print("\n resume summary generated successfully.")

            print("\n ats report generating process started ...")
            ats_report = ats_scanner(resume_summary)
            print("\n ats report generated successfully.")
            # print(ats_report)

            # print("\nATS Report:\n", ats_report)

            match = re.search(r"Score\s*[\r\n]+\s*(\d+)%", ats_report)

            # If a match is found, print the score
            if match:
                score = match.group(1)
                print("\nThe score is:", score)
            else:
                print("No score found.")


        else:
            print("resumeURL not found in the message")

    channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
    print(f"Waiting for messages in queue: {queue_name}")
    channel.start_consuming()
