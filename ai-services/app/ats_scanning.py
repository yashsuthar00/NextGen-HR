import os
from urllib.parse import urlparse, unquote
from google.cloud import vision, storage
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Constants
SERVICE_ACCOUNT_JSON = r"./temp/nextgen-hr-bc45ed808e53.json"
GCS_DESTINATION_URI = "gs://bucket_nextgen-hr/destination_json_data/"
API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise ValueError("GROQ_API_KEY environment variable not set.")


# Initialize Groq Client
client = Groq(api_key=API_KEY)

# Function 1 - Extract text from PDF using Google Vision API


def async_detect_text_in_pdf(
    gcs_source_uri,
    service_account_json_path=SERVICE_ACCOUNT_JSON,
    gcs_destination_uri=GCS_DESTINATION_URI,
):
    # Convert signed URL to gs:// URI if necessary.
    if gcs_source_uri.startswith("https://"):
        parsed_url = urlparse(gcs_source_uri)
        # Expecting path in the format: /bucket/object_name
        path_parts = parsed_url.path.lstrip("/").split("/", 1)
        if len(path_parts) == 2:
            bucket, object_path = path_parts
            # Decode URL-encoded parts of the object name
            object_path = unquote(object_path)
            gcs_source_uri = f"gs://{bucket}/{object_path}"
        else:
            raise ValueError("Invalid signed URL format provided for gcs_source_uri.")

    # Initialize the Vision API client.
    client = vision.ImageAnnotatorClient.from_service_account_json(
        service_account_json_path
    )
    feature = vision.Feature(type=vision.Feature.Type.DOCUMENT_TEXT_DETECTION)

    # Set up the input configuration using the converted GCS URI.
    gcs_source = vision.GcsSource(uri=gcs_source_uri)
    input_config = vision.InputConfig(
        gcs_source=gcs_source, mime_type="application/pdf"
    )

    # Set up the output configuration.
    gcs_destination = vision.GcsDestination(uri=gcs_destination_uri)
    output_config = vision.OutputConfig(gcs_destination=gcs_destination, batch_size=1)

    # Prepare and send the asynchronous request.
    async_request = vision.AsyncAnnotateFileRequest(
        features=[feature], input_config=input_config, output_config=output_config
    )

    operation = client.async_batch_annotate_files(requests=[async_request])
    print("Waiting for operation to complete...")
    operation.result(timeout=300)

    # Process the output from the destination bucket.
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
    system_message = {"role": "system", "content": system_prompt}
    user_message = {"role": "user", "content": resume_text}

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
    user_prompt = (
        f"Resume Summary:\n{resume_summary}\n\nJob Description:\n{job_description}"
    )
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
