import os
import google.auth
from google.cloud import storage
from groq import Groq

from dotenv import load_dotenv
# API Key
API_KEY = os.getenv('GROQ_API_KEY')
# Load environment variables
load_dotenv()
client = Groq(api_key=API_KEY)

SERVICE_ACCOUNT_PATH = ".././env/nextgen-hr-8ce4fa070811.json"

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = SERVICE_ACCOUNT_PATH# ✅ Verify authentication

try:
    credentials, project = google.auth.default()
    print(f"✅ Google Cloud authenticated for project: {project}")
except google.auth.exceptions.DefaultCredentialsError:
    print("❌ Error: Google Cloud authentication failed.")
    print("👉 Make sure the service account key path is correct:")
    print(f"   {SERVICE_ACCOUNT_PATH}")
    exit(1)

GCS_FILE_PATH = "gs://bucket_nextgen-hr/1743803229843_mern_answer.m4a"

# Extract bucket name and file path from GCS path
def parse_gcs_path(gcs_path):
    if not gcs_path.startswith("gs://"):
        raise ValueError("Invalid GCS path. It must start with 'gs://'")

    parts = gcs_path[5:].split("/", 1)
    if len(parts) < 2:
        raise ValueError("Invalid GCS path. It must contain a bucket and file name.")

    return parts[0], parts[1]  # (bucket_name, file_name)

# Initialize Google Cloud Storage Client
client_gcs = storage.Client()

def download_audio_from_gcs(gcs_path):
    """Download the audio file from Google Cloud Storage."""
    bucket_name, file_name = parse_gcs_path(gcs_path)
    bucket = client_gcs.bucket(bucket_name)
    blob = bucket.blob(file_name)
    print("🔄 Downloading audio file from GCS...")
    print(f"   gcs path: {gcs_path}")
    temp_audio_path = f"/tmp/{file_name}"  # Temporary local file pathj
    print(f"   local path: {temp_audio_path}")
    blob.download_to_filename(temp_audio_path)
    print(f"✅ Downloaded to: {temp_audio_path}")

    return temp_audio_path


def speech_to_text(audio_path):
    """Send audio file to Groq API for transcription."""
    with open(audio_path, "rb") as file:
        transcription = client.audio.transcriptions.create(
            file=(audio_path, file.read()),
            model="whisper-large-v3-turbo",
            response_format="json",
            temperature=0.0
        )
    return transcription.text

system_prompt = """
    You are an expert evaluator tasked with assessing candidate answers to a wide range of questions. Your evaluation should consider the following criteria and provide detailed feedback along with a final score out of 100.
    Evaluate in a manner that is consistent and consider the candidate to be intermediate.. so evaluate accordingly.
    Evaluation Criteria:
    1. Relevance (15 points): 
    - Does the answer directly address the core aspects of the question?
    - Is it focused and on-topic?
    2. Depth of Knowledge (25 points):
    - Does the answer demonstrate a deep understanding of the subject?
    - Is the explanation detailed and thorough?
    3. Clarity and Coherence (20 points):
    - Is the answer well-organized, easy to understand, and logically structured?
    4. Creativity and Originality (15 points):
    - Does the answer offer unique insights, innovative approaches, or thoughtful perspectives?
    5. Practical Application (15 points):
    - For technical questions, does the answer illustrate real-world applications or provide relevant examples?
    6. Communication Skills (10 points):
    - Is the answer communicated professionally, concisely, and in accessible language?
    7. Problem-Solving Ability (10 points):
    - For troubleshooting or problem-solving questions, does the candidate present a clear, structured, and logical approach?

    If any of these criteria are not applicable to the question (for example, Practical Application or Problem-Solving Ability for non-technical or non-problem scenarios), omit that criterion and proportionally redistribute its weight among the applicable criteria so that the total possible score remains 100.

    IMPORTANT: Your output must be only cumulative final score out of 100 with no headings, commentary, or additional text.
    """

def evaluate_question_answer(question_text, answer_text, system_prompt=system_prompt):
    # System message with provided system prompt
    system_message = {
        "role": "system",
        "content": system_prompt
    }

    user_prompt = f"""Please evaluate the following candidate answer based on the criteria provided.
    Question:
    {question_text}

    Candidate's Answer:
    {answer_text}
    """
    
    # User message combining the question and answer text
    user_message = {
        "role": "user",
        "content": user_prompt
    }

    # Send the request to the API
    stream = client.chat.completions.create(
        messages=[system_message, user_message],
        model="llama-3.3-70b-versatile",
        temperature=0.5,
        max_completion_tokens=1024,
        top_p=1,
        stop=None,
        stream=True,
    )

    # Collecting the evaluation result from the stream
    evaluation = ""
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content is not None:
            evaluation += content

    return evaluation

def main():




    # question_text = "How do you handle user authentication in a MERN stack application using JWT (JSON Web Tokens)?"
    question_text = "What is the difference between supervised and unsupervised learning in machine learning, and when would you use each?"

    audio_path = download_audio_from_gcs(GCS_FILE_PATH)

    answer_text = speech_to_text(audio_path)
    print(f"Answer: {answer_text}\n")

    evaluation = evaluate_question_answer(question_text, answer_text)

    print("Evaluation Result:")
    print(evaluation)

