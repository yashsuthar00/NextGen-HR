import pika
import json
import re
import time
from flask import current_app
from app.service.resume import process_resume, async_detect_text_in_pdf, summarize_resume, ats_scanner  
from app.service.questionsGenerator import generate_interview_questions, split_questions, ensure_question_marks, process_questions
from app.service.interviewData import fetch_interview_data
from app.service.applicationData import fetch_application_data
from app.service.interviewProcess import download_audio_from_gcs, speech_to_text, evaluate_question_answer
from app import app  

SERVICE_ACCOUNT_JSON = r"./../env/nextgen-hr-8ce4fa070811.json"
GCS_DESTINATION_URI = "gs://bucket_nextgen-hr/vision_output/"

def start_consumer():
    while True:  # Reconnection loop
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters('localhost', heartbeat=10)  # Enable heartbeats
            )
            channel = connection.channel()

            # Existing queue for job applications
            job_application_queue = 'new_job_application_queue'
            channel.queue_declare(queue=job_application_queue, durable=False)

            # New queue for completed interviews
            interview_completed_queue = 'interview_completed_queue'
            channel.queue_declare(queue=interview_completed_queue, durable=False)

            def job_application_callback(ch, method, properties, body):
                try:
                    message = json.loads(body)
                    print(f"Received message from {job_application_queue}: {message}")
                    
                    document = fetch_application_data(message)
                    print("\nFetched application document:", document)

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
                        job_description = document['jobDetails']['description']
                        print("\n job description from the document:", job_description)
                        ats_report = ats_scanner(resume_summary, job_description)
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
                        questions = generate_interview_questions(resume_summary, job_description)
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
                except Exception as e:
                    print(f"Error in job_application_callback: {e}")

            def interview_completed_callback(ch, method, properties, body):
                try:
                    message = json.loads(body)
                    print(f"Received message from {interview_completed_queue}: {message}")
                    
                    # Process the completed interview document
                    interview_id = message
                    if interview_id:
                        print(f"Processing completed interview with ID: {interview_id}")

                        # Fetch the interview document using the ID
                        interview_document = fetch_interview_data(interview_id)
                        print("\nFetched interview document:", interview_document)

                        questions = interview_document['questions']
                        print("\n Interview questions:", questions)

                        total_score = 0

                        for question in questions:
                            question_text = question['question']
                            print("\n Question:", question_text)

                            audio_answer_url = question['answerAudioUrl']
                        
                            audio_path = download_audio_from_gcs(audio_answer_url)

                            answer_text = speech_to_text(audio_path)
                            print(f"Answer: {answer_text}\n")

                            evaluation = evaluate_question_answer(question_text, answer_text)

                            print("Evaluation Result:")
                            print(evaluation)

                            total_score += int(evaluation)

                            # Add evaluation result and answer to the question document
                            question['evaluation'] = evaluation
                            question['answer'] = answer_text

                        # Calculate the average score
                        average_score = total_score / len(questions) if questions else 0
                        print(f"Average Score: {average_score}")
                        # Add average score to the interview document
                        interview_document['averageScore'] = average_score
                        print("\nInterview document with average score updated successfully:")
                        # print(interview_document)

                        print("\nEvaluated questions with answers and evaluations created successfully:")
                        # print(questions)
                        # Update the interview document with the evaluated questions
                        mongo_instance = app.config['MONGO']
                        result = mongo_instance.db.interviews.update_one(
                            {'_id': interview_document['_id']},
                            {'$set': {'questions': questions, 'averageScore': average_score}}
                        )
                        if result.modified_count > 0:
                            print("Interview document updated successfully.")
                        else:
                            print("Failed to update the interview document.")
                        
                        # Add any additional processing logic here if needed
                    else:
                        print("Invalid message format: '_id' not found.")
                except Exception as e:
                    print(f"Error in interview_completed_callback: {e}")

            # Bind callbacks to respective queues
            channel.basic_consume(queue=job_application_queue, on_message_callback=job_application_callback, auto_ack=True)
            channel.basic_consume(queue=interview_completed_queue, on_message_callback=interview_completed_callback, auto_ack=True)

            print(f"Waiting for messages in queues: {job_application_queue}, {interview_completed_queue}")
            channel.start_consuming()
        except pika.exceptions.AMQPConnectionError as e:
            print(f"RabbitMQ connection error: {e}. Reconnecting in 5 seconds...")
            time.sleep(5)  # Wait before reconnecting
        except Exception as e:
            print(f"Unexpected error: {e}. Reconnecting in 5 seconds...")
            time.sleep(5)