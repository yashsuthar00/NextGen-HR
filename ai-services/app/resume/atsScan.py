import os
import time
from google.cloud import vision, storage
from dotenv import load_dotenv
from groq import Groq
import re

# Load environment variables
load_dotenv()

# Constants
SERVICE_ACCOUNT_JSON = r".././env/nextgen-hr-8ce4fa070811.json"
GCS_SOURCE_URI = "gs://bucket_nextgen-hr/Parikshit Resume-(Sept 2024).pdf"
GCS_DESTINATION_URI = "gs://bucket_nextgen-hr/vision_output/"
API_KEY = os.getenv('GROQ_API_KEY')

# Initialize Groq Client
client = Groq(api_key=API_KEY)


# Function 1 - Extract text from PDF using Google Vision API
def async_detect_text_in_pdf(service_account_json_path, gcs_source_uri, gcs_destination_uri):
    client = vision.ImageAnnotatorClient.from_service_account_json(service_account_json_path)

    feature = vision.Feature(type=vision.Feature.Type.DOCUMENT_TEXT_DETECTION)
    gcs_source = vision.GcsSource(uri=gcs_source_uri)
    input_config = vision.InputConfig(gcs_source=gcs_source, mime_type="application/pdf")

    gcs_destination = vision.GcsDestination(uri=gcs_destination_uri)
    output_config = vision.OutputConfig(gcs_destination=gcs_destination, batch_size=1)

    async_request = vision.AsyncAnnotateFileRequest(
        features=[feature],
        input_config=input_config,
        output_config=output_config
    )

    operation = client.async_batch_annotate_files(requests=[async_request])
    print("Waiting for operation to complete...")
    operation.result(timeout=300)

    storage_client = storage.Client.from_service_account_json(service_account_json_path)

    bucket_name = gcs_destination_uri.replace("gs://", "").split("/", 1)[0]
    prefix = gcs_destination_uri.replace(f"gs://{bucket_name}/", "")

    bucket = storage_client.bucket(bucket_name)
    blob_list = list(bucket.list_blobs(prefix=prefix))

    full_text_markdown = []

    for blob in blob_list:
        if not blob.name.endswith(".json"):
            continue

        json_data = blob.download_as_bytes()
        if not json_data:
            continue

        response = vision.AnnotateFileResponse.from_json(json_data)

        for annotation_response in response.responses:
            if annotation_response.full_text_annotation.text:
                full_text_markdown.append(annotation_response.full_text_annotation.text)

    return "\n".join(full_text_markdown)


# Function 2 - Summarize Resume
def summarize_resume(resume_text, system_prompt):
    system_message = {
        "role": "system", 
        "content": system_prompt
    }
    
    user_message = {
        "role": "user", 
        "content": resume_text
    }

    stream = client.chat.completions.create(
        messages=[system_message, user_message],
        model="llama-3.3-70b-versatile",
        temperature=0.5,
        max_completion_tokens=1024,
        top_p=1,
        stop=None,
        stream=True,
    )

    summary = ""
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content is not None:
            summary += content

    return summary


# Function 3 - ATS Scanner
def ats_scanner(job_description, system_prompt, resume_summary):
    system_message = {"role": "system", "content": system_prompt}
    user_prompt = f"Resume Summary:\n{resume_summary}\n\nJob Description:\n{job_description}"
    user_message = {"role": "user", "content": user_prompt}

    stream = client.chat.completions.create(
        messages=[system_message, user_message],
        model="llama-3.3-70b-versatile",
        temperature=0.5,
        max_completion_tokens=1024,
        top_p=1,
        stop=None,
        stream=True,
    )

    report = ""
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content is not None:
            report += content

    return report


# Main Function - Full Workflow
def main():
    # Step 1 - Extract text from resume PDF
    resume_text = async_detect_text_in_pdf(SERVICE_ACCOUNT_JSON, GCS_SOURCE_URI, GCS_DESTINATION_URI)
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
    You are tasked with evaluating the compatibility of a resume summary report with a given job description, ensuring it is fully optimized for Applicant Tracking Systems (ATS). **Before beginning the evaluation, carefully analyze both the resume summary and the job description to identify key skills, qualifications, responsibilities, and keywords.** Your evaluation must be consistent and detailed every time.
    In your response, never use something like resume summary, instead always use resume.
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

    **Make sure the output always strictly follows this structure:**  
    1. "Score" heading followed by the percentage score and nothing else in text.  
    2. "Summary" heading followed by the detailed evaluation report.
    """ 

    # Step 6 - Generate ATS Score & Feedback
    print("\n\n\n")
    ats_report = ats_scanner(job_description, ats_prompt, resume_summary)
    print("\nATS Report:\n", ats_report)

    match = re.search(r"Score\s*[\r\n]+\s*(\d+)%", ats_report)

    # If a match is found, print the score
    if match:
        score = match.group(1)
        print("\nThe score is:", score)
    else:
        print("No score found.")

    # Extract score with a refined regex that matches the header format
    score_match = re.search(r"##\s*\d+\.\s*Score\s*[\r\n]+\s*(\d+)%", ats_report)
    if score_match:
        score = score_match.group(1)
        print("2 The score is:", score)
    else:
        print("2 No score found.")

    # Define patterns for the three sections.
    # These patterns capture all text after the header until the next header (starting with '###') or the end of the string.
    pattern_keyword = r"### Keyword Optimization:\s*(.*?)(?=\n###|\Z)"
    pattern_jobrole = r"### Job-Role Alignment:\s*(.*?)(?=\n###|\Z)"
    pattern_skills = r"### Skills and Experience Relevance:\s*(.*?)(?=\n###|\Z)"

    keyword_match = re.search(pattern_keyword, ats_report, re.DOTALL)
    jobrole_match = re.search(pattern_jobrole, ats_report, re.DOTALL)
    skills_match = re.search(pattern_skills, ats_report, re.DOTALL)

    keyword_text = keyword_match.group(1).strip() if keyword_match else "Not found"
    jobrole_text = jobrole_match.group(1).strip() if jobrole_match else "Not found"
    skills_text = skills_match.group(1).strip() if skills_match else "Not found"

    print("\nKeyword Optimization:\n", keyword_text)
    print("\nJob-Role Alignment:\n", jobrole_text)
    print("\nSkills and Experience Relevance:\n", skills_text)

if __name__ == "__main__":
    main()