import base64
import os
import logging
from groq import Groq
from connect_memory_to_llm import Rag  # Import the RAG function

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def encode_image(image_path):
    """Encode an image file to base64 string with improved error handling."""
    try:
        with open(image_path, "rb") as image_file:
            image_data = image_file.read()
            if not image_data:
                logging.error(f"Image file is empty: {image_path}")
                return None
            logging.info(f"Successfully read image: {image_path} (size: {len(image_data)} bytes)")
            encoded = base64.b64encode(image_data).decode('utf-8')
            return encoded
    except Exception as e:
        logging.error(f"Error encoding image {image_path}: {str(e)}")
        return None

def analyze_image_with_query(query, model, encoded_image, api_key=None):
    """Process an image with a text query using Groq's multimodal capabilities."""
    groq_api_key = api_key or os.environ.get("GROQ_API_KEY")
    client = Groq(api_key=groq_api_key)
    
    if not encoded_image:
        logging.error("No encoded image provided to analyze_image_with_query")
        return "I'm unable to analyze the image as it appears to be missing or corrupted."
    
    logging.info(f"Preparing multimodal message with text query and image (encoded length: {len(encoded_image)})")
    
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": query},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}}
            ]
        }
    ]
    
    try:
        logging.info(f"Sending multimodal request to Groq API with model: {model}")
        chat_completion = client.chat.completions.create(
            messages=messages,
            model=model
        )
        logging.info("Successfully received response from Groq API for image analysis")
        return chat_completion.choices[0].message.content
    except Exception as e:
        logging.error(f"Error in analyze_image_with_query: {str(e)}")
        return f"I encountered an error while analyzing your image: {str(e)}"

def generate_doctor_response_text(query, model, api_key=None):
    """
    Generate a doctor response using Groq in a text-only mode.
    First retrieves relevant medical information using RAG, then sends to Groq.
    """
    groq_api_key = api_key or os.environ.get("GROQ_API_KEY")
    client = Groq(api_key=groq_api_key)
    
    # Get medical encyclopedia information using RAG
    try:
        rag_results = Rag(query)
        logging.info("Successfully retrieved RAG results")
    except Exception as e:
        logging.error(f"Error retrieving RAG results: {str(e)}")
        rag_results = "No additional medical information available at this time."
    
    # Construct enhanced query with RAG results
    enhanced_query = (
        f"Patient Query: {query}\n\n"
        f"Relevant Medical Information: {rag_results}\n\n"
        f"Based on the patient's query and the provided medical information, "
        f"please provide a detailed and accurate medical response."
    )
    
    # Handle different query formats (string or conversation array)
    if isinstance(query, str):
        messages = [{"role": "user", "content": enhanced_query}]
    else:
        # Assume it's a conversation array
        messages = query.copy()
        for i in range(len(messages) - 1, -1, -1):
            if messages[i]["role"] == "user":
                messages[i]["content"] = enhanced_query
                break
    
    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model=model
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        logging.error(f"Error generating response: {str(e)}")
        return "I'm sorry, I encountered an error while processing your request."