import time
from kafka import KafkaConsumer

from app.mongo_handler import store_resume_data
from app.ats_scanning import async_detect_text_in_pdf
from app.ats_scanning import summarize_resume
from app.ats_scanning import ats_scanner

def create_consumer_with_retry(max_retries=10, delay=5):
    """
    Attempts to create a KafkaConsumer instance. 
    Retries connection if Kafka is not yet ready.
    """
    attempt = 0
    while attempt < max_retries:
        try:
            consumer = KafkaConsumer(
                'resume-uploads',
                bootstrap_servers=['kafka:9092'],  # Update if needed
                auto_offset_reset='earliest',
                group_id='python-service-group',
                value_deserializer=lambda m: m.decode('utf-8')
            )
            print("Connected to Kafka.")
            return consumer
        except Exception as e:
            attempt += 1
            print(f"Attempt {attempt}/{max_retries} - Failed to connect to Kafka: {e}")
            print(f"Retrying in {delay} seconds...")
            time.sleep(delay)
    raise Exception("Could not create Kafka consumer after multiple attempts.")

def start_consumer():
    # Attempt to create a consumer with retry logic
    consumer = create_consumer_with_retry()
    print("Kafka consumer started. Waiting for messages...")
    for message in consumer:
        file_url = message.value
        print(f"Received message: {file_url}")
        try:
            # Step 1 - Extract text from resume PDF
            resume_text = async_detect_text_in_pdf(file_url)
            print("\nExtracted Resume Text:\n", resume_text)

            # Step 2 - System prompt for resume summarization
            summarization_prompt = """
            You are a resume summarization tool specifically designed to create standardized summaries optimized for Applicant Tracking Systems (ATS). 
            Your task is to generate a precise and detailed summary from the provided resume text. 
            Follow these instructions exactly and always output the summary using the exact structure below.
            If the information is available, only provide it in the specific section. Do not create or assume details yourself.

            1. **Candidate Details**  
            - Extract and list the candidate’s full name.
            - Include the location (city and country).
            - Provide contact information (phone number and email address).
            - Include the LinkedIn profile URL if available.

            2. **Education**  
            - For each education entry, list:
                - Institution name.
                - Degree earned and field of study.
                - Relevant dates (graduation date or period of study).
                - CGPA or other academic performance indicators (if provided).
            - Format each education entry as a bullet point.

            3. **Certifications**  
            - List each certification with its name.
            - Include dates or timeframes if available.
            - Use bullet points for each certification.

            4. **Relevant Experience**  
            - For each work experience entry, provide:
                - Company name and location.
                - Job title/role.
                - Duration (start and end dates).
                - A bullet-point list of key responsibilities and achievements.
                - Emphasize responsibilities that highlight technical skills, problem-solving, leadership, and quantifiable achievements.
                - Use action verbs and include keywords relevant to technical roles.
            - Ensure that this section is detailed as it is critical for ATS scanning.

            5. **Projects**  
            - List significant projects with:
                - Project name.
                - Completion date or period.
                - A concise description of the project.
                - Key technologies and skills used.
            - Use bullet points for clarity.

            6. **Skills**  
            - Categorize skills into:
                - Technical Skills (e.g., programming languages, data analysis, engineering, research techniques).
                - Tools and Technologies (e.g., software, platforms, frameworks, specific tools, libraries).
                - Soft Skills (if applicable).
            - List these in bullet-point format.

            7. **Additional Information** (Optional)  
            - Include any other relevant details (such as interests or extracurricular activities) only if they support the job requirements.
            - This section should be brief and directly related to enhancing the candidate’s profile for the role.

            **Formatting Guidelines**:
            - Always use the same order and headings for each summary.
            - Use clear and consistent headings
            """

            # Step 3 - Summarize resume
            resume_summary = summarize_resume(resume_text, summarization_prompt)
            print("\n\n\n")
            print("\nGenerated Resume Summary:\n", resume_summary)

            # Step 4 - Job description (You can modify this variable to your actual job description)
            job_description = """
            Job Title: Machine Learning Engineer - Computer Vision

            Location: [Location or Remote]

            Job Type: Full-Time

            About Us:
            [Company Name] is a cutting-edge technology company focused on solving complex real-world problems through the power of artificial intelligence and machine learning. We are a team of innovators dedicated to pushing the boundaries of what's possible in computer vision and machine learning, and we’re looking for a passionate and talented Machine Learning Engineer to join our team.

            Position Overview:
            We are seeking a highly skilled and motivated Machine Learning Engineer with expertise in Computer Vision to contribute to the development and enhancement of our AI-powered solutions. The ideal candidate will work on developing and deploying state-of-the-art machine learning models, with a strong emphasis on computer vision applications such as image classification, object detection, semantic segmentation, and other related tasks.

            Key Responsibilities:

            Design, develop, and deploy machine learning models and algorithms for computer vision tasks (e.g., image classification, object detection, facial recognition, segmentation).
            Work with large datasets, preprocessing and augmenting them to optimize model performance.
            Implement and fine-tune deep learning models using frameworks like TensorFlow, PyTorch, and Keras for real-time applications.
            Collaborate with cross-functional teams to integrate machine learning models into production systems.
            Conduct research and stay up-to-date on the latest advancements in computer vision, deep learning, and AI techniques.
            Monitor model performance and improve accuracy, efficiency, and scalability.
            Develop and maintain end-to-end machine learning pipelines, from data collection to model deployment.
            Troubleshoot and resolve any issues related to model performance, overfitting, or underfitting.
            Present findings, results, and insights to stakeholders in both technical and non-technical terms.
            Qualifications:

            Bachelor's or Master’s degree in Computer Science, Electrical Engineering, Mathematics, or a related field (PhD is a plus).
            Proven experience (2+ years) in machine learning with a strong focus on computer vision.
            Strong proficiency in deep learning frameworks such as TensorFlow, PyTorch, Keras, or similar.
            Familiarity with computer vision techniques such as convolutional neural networks (CNNs), generative adversarial networks (GANs), and transfer learning.
            Solid understanding of computer vision tasks such as image segmentation, object detection, and image classification.
            Experience with large-scale data handling, data augmentation, and feature engineering.
            Expertise in programming languages such as Python, C++, or Java.
            Familiarity with cloud platforms (AWS, Google Cloud, Azure) for model deployment and scaling.
            Experience with version control systems (e.g., Git).
            Strong problem-solving skills and ability to work independently and in a team.
            Excellent communication skills, both written and verbal.
            Preferred Qualifications:

            Experience with reinforcement learning, multi-modal learning, or 3D computer vision.
            Experience with deploying machine learning models to production environments.
            Knowledge of edge computing and optimization for resource-constrained devices (e.g., mobile devices, embedded systems).
            Contributions to open-source computer vision projects or research publications in the field.
            Why [Company Name]?

            Competitive salary and benefits package.
            Opportunity to work on cutting-edge AI and computer vision technologies.
            A collaborative and dynamic work environment.
            Access to training, professional development, and conference opportunities.
            Flexible work arrangements, including remote work options.
            If you're excited to work in a fast-paced, innovative environment and contribute to the development of transformative computer vision applications, we'd love to hear from you!

            How to Apply:
            Please submit your resume, a portfolio or GitHub link showcasing relevant projects, and a cover letter explaining why you would be a great fit for this role.
            """

            # Step 5 - System prompt for ATS scanning
            ats_prompt = """
            **ATS Compatibility Evaluation Prompt**

            You are tasked with evaluating the compatibility of a resume summary report with a given job description, ensuring it is fully optimized for Applicant Tracking Systems (ATS). **Before beginning the evaluation, carefully analyze both the resume summary and the job description to identify key skills, qualifications, responsibilities, and keywords.** Your evaluation must be consistent and detailed every time.

            Please adhere to the following instructions:

            1. **Score Section**  
            - Provide an exact percentage score that reflects how well the resume summary aligns with the job description for ATS systems.  
            - The score should be based on:
                - **Keyword Matching:** How effectively the resume summary incorporates the essential keywords from the job description.
                - **Relevant Skills:** The presence and proper integration of core skills and qualifications required for the role.
                - **Overall Alignment:** The degree to which the resume summary reflects the responsibilities and requirements of the job.
            
            2. **Summary Section**  
            Provide detailed feedback and actionable suggestions in the following sub-sections:
            - **Keyword Optimization:**  
                - Analyze whether the resume summary includes all relevant keywords from the job description.  
                - Note if any keywords are missing, overused, or poorly integrated.  
                - Suggest improvements for incorporating keywords more naturally and effectively.
            - **Job-Role Alignment:**  
                - Evaluate how closely the resume summary matches the core responsibilities and requirements specified in the job description.  
                - Recommend adjustments to better align the summary with the job role.
            - **Skills and Experience Relevance:**  
                - Assess if the resume summary highlights the necessary skills and experiences sought by the employer.  
                - Propose additions or modifications to better showcase the applicant's suitability.
            - **Suggestions for Improvement:**  
                - Offer actionable steps to enhance the resume summary's ATS compatibility.  
                - This may include rewording sentences, refining phrasing, or adding missing details from the job description.

            **Make sure the output always strictly follows this structure:**  
            1. "Score" heading followed by the percentage score and nothing else in text.  
            2. "Summary" heading followed by the detailed evaluation report.
            """
            
            # Step 6 - Generate ATS Score & Feedback
            print("\n\n\n")
            ats_report = ats_scanner(job_description, ats_prompt, resume_summary)
            print("\nATS Report:\n", ats_report)
            
        except Exception as e:
            print(f"Error processing resume from {file_url}: {e}")

if __name__ == "__main__":
    start_consumer()
