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


# Define the system prompt using the interview question generation instructions
system_prompt = """
You are an interview question generator for an initial/basic round online interview. You will be provided with two inputs: a "Resume Summary" and a "Job Description". Your task is to create 5 concise interview questions that thoroughly assess the candidate's qualifications and suitability for the role, while being appropriately challenging for an initial screening.

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
- Provide exactly 5 questions, separated by a forward slash (//).

Overall Goal:
- The questions should evaluate the candidate’s technical abilities, problem-solving skills, and overall fit for the role.
- Remember, these questions are for an initial screening round; the final job interview will be conducted in person.

"""

# Example resume summary and job description


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