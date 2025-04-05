import os
import time
from google.cloud import vision, storage
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Initialize Groq Client
API_KEY = os.getenv('GROQ_API_KEY')
client = Groq(api_key=API_KEY)

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
    Please submit your resume, a portfolio or GitHub link showcasing relevant projects, and a cover letter explaining why you would be a great fit for this role."""

# Define the system prompt using the interview question generation instructions
system_prompt = """
You are an interview question generator for an initial/basic round online interview. You will be provided with two inputs: a "Resume Summary" and a "Job Description". Your task is to create 10 concise interview questions that thoroughly assess the candidate's qualifications and suitability for the role, while being appropriately challenging for an initial screening.

Instructions:

1. Equal Weighting:
- Analyze both the Resume Summary and the Job Description.
- Ensure that both sources are equally considered when formulating the questions.

2. Content Focus:
- Derive questions based on the skills, experiences, and relevant factors mentioned in both documents.
- Include a balanced mix of technical questions and general (behavioral or situational) questions.
- Ensure the questions are suitable for an initial online interview—challenging enough to gauge competency, yet not overly complex for entry-level or fresher candidates.

3. Question Format:
- Each question should be concise and structured to be answerable within 2-3 minutes.
- Avoid overly lengthy or complex questions.

4. Output Format:
- Do not include any heading lines, introductory text, numbering, or labels for the questions.
- Do not add any conclusion or summary lines.
- Each question should be ending with a question mark (?).
- Provide exactly 10 questions, separated by a forward slash (//).

Overall Goal:
- The questions should evaluate the candidate’s technical abilities, problem-solving skills, and overall fit for the role.
- Remember, these questions are for an initial screening round; the final job interview will be conducted in person.

"""

# Example resume summary and job description
resume_summary = """
 ## 1. **Candidate Details**
- Parikshit Talaviya
- Location: Ahmedabad, India
- Contact Information: (+91) 8000000365, parikshittalaviya123@gmail.com
- LinkedIn Profile URL: linkedin.com/parikshit-talaviya

## 2. **Education**
- Indus University: Bachelor of Technology in Computer Science Engineering, CGPA: 9.8
- S.G.V.P International School: Standard 12th
- S.G.V.P International School: Standard 10th

## 3. **Certifications**
- Web Development Bootcamp (Udemy)
- Machine Learning Specialization (Coursera)
- AWS Academy Machine Learning Foundation
- AWS Academy Machine Learning Foundation for Natural Language Processing

## 4. **Relevant Experience**
- **Turabit Solutions Pvt. Ltd.**, Machine Learning Intern, Ahmedabad, India, May 2024 - June 2024
  - Developed a yoga posture prediction and correction system integrating machine learning for enhanced posture analysis.
  - Involved in data cleaning and preparation using various machine learning techniques.
- **SHALIGRAM INFOTECH**, Web Development Intern, Ahmedabad, India, Jun 2023 - Jul 2023
  - Designed responsive web pages using HTML, CSS, and JavaScript, reducing loading times and packaging websites for better user experiences.
  - Developed a MySQL database connection for websites in cooperation with a five-person team.

## 5. **Projects**
- **Laundry Management System**, Apr 2023
  - Designed a user-friendly system for seamless slot booking, cancellation, order management, and admin control.
  - Employed HashMap data structure for efficient storage and retrieval of customer information, orders, and inventory.
- **Music Streaming Platform (Spotify Clone)**, Oct 2023
  - Developed a music streaming platform with responsive layouts using HTML, CSS, and JavaScript.
  - Implemented real-time song playback, playlist management, and interactive features to enhance user experience.
- **Chatbot**, Sept 2023
  - Created a Python-based chatbot with an interactive UI and JSON for data storage.
  - Enabled the chatbot to select responses based on patterned questions using JSON as a structured data source.
- **Bank Management System**, Apr 2024
  - Collaborated in a team to develop a Bank Management System.
  - Designed a responsive front-end using HTML, CSS, and JavaScript, integrating MySQL for secure data storage and management.
- **Yoga Posture Detection**, Aug 2024
  - Developed a model for real-time classification of yoga postures with a focus on Suryanamaskar poses.
  - Utilized computer vision techniques to feed real-time data into the model for accurate posture detection.

## 6. **Skills**
- **Technical Skills**: Machine Learning, Computer Vision, Natural Language Processing, MediaPipe, Java, Spring Boot, Python, C++, HTML, CSS, JavaScript
- **Libraries**: OpenCv, NumPy, Pandas, SKlearn, Scikit
- **Additional Skills**: Data Analysis, PHP, MySQL, Microsoft PowerPoint, Canva

## 7. **Additional Information**
- Interests: Basketball (College-level Basketball Player), Painting, Skydiving (Jumped from an altitude exceeding 13,000 feet), Yoga, and Meditation"""


def generate_interview_questions(resume_summary, job_description, system_prompt = system_prompt):
    # Define the system message using the provided prompt
    system_message = {
        "role": "system",
        "content": system_prompt
    }

    # Combine resume summary and job description into the user prompt
    user_prompt = "Resume Summary:\n" + resume_summary + "\nJob Description:\n" + job_description
    user_message = {
        "role": "user",
        "content": user_prompt
    }
    
    # Call the Groq API using the Llama Versatile 70B model
    stream = client.chat.completions.create(
        messages=[system_message, user_message],
        model="llama-3.3-70b-versatile",
        temperature=0.5,
        max_completion_tokens=1024,
        top_p=1,
        stop=None,
        stream=True,
    )

    # Collect the streamed response
    questions = ""
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content is not None:
            questions += content
            
    return questions


def split_questions(input_string):
    # Split the string by the "//" separator
    questions_array = input_string.split("//")
    
    # Strip whitespace from each question
    questions_array = [question.strip() for question in questions_array]
    
    # Filter out any empty strings
    questions_array = [question for question in questions_array if question]
    
    return questions_array

def ensure_question_marks(questions_array):
    """
    Iterate through each question in the array and add a question mark
    if it doesn't already end with one.
    """
    for i in range(len(questions_array)):
        # Strip any trailing whitespace
        questions_array[i] = questions_array[i].rstrip()
        
        # Check if the question already ends with a question mark
        if not questions_array[i].endswith('?'):
            questions_array[i] += '?'
    
    return questions_array


def process_questions(input_string):
      """
      Combines splitting, ensuring question marks, and formatting questions into objects.
      """
      # Split the string by the "//" separator
      questions_array = input_string.split("//")
      
      # Strip whitespace from each question and filter out empty strings
      questions_array = [question.strip() for question in questions_array if question.strip()]
      
      # Ensure each question ends with a question mark
      for i in range(len(questions_array)):
        if not questions_array[i].endswith('?'):
          questions_array[i] += '?'
      
      # Convert the array of questions into an array of objects
      return [{"question": question} for question in questions_array]