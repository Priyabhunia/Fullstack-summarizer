# Importing necessary libraries and modules
# Flask for web framework and routing
from flask import Blueprint, request, jsonify

# Requests library for making HTTP API calls
import requests

# OS for handling environment variables
import os

# dotenv for loading environment variables from .env file
from dotenv import load_dotenv

# Custom database connection function
from database import get_db_connection

# Import token authentication decorator from auth module
from auth import token_required

# Load environment variables from .env file
load_dotenv()

# Retrieve Hugging Face API token from environment variables
HF_API_TOKEN = os.getenv('HF_API_TOKEN')

# Hugging Face API endpoint for text summarization
# Using Facebook's BART large CNN model for summarization
HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn'

#create a flask blueprint for summarization route 
summarize_bp = Blueprint('summarize',__name__)

def summarize_text(text):
    """
    Send text to Hugging Face API for summarization
    
    Args:
        text (str): The original text to be summarized
    
    Returns:
        str: Summarized text or error message
    """
    # Prepare API request headers with authentication token
    headers = {'Authorization': f'Bearer {HF_API_TOKEN}'}


    # Prepare payload with input text and summarization parameters
    # max_length: Maximum length of the summary
    # min_length: Minimum length of the summary

    payload = {'inputs':text, 'parameters': {'max_length':100,'min_length':50}}
    # Send POST request to Hugging Face API
    response = requests.post(HF_API_URL,headers=headers, json=payload)

    if response.status_code ==200:
        #return generated summary

        return response.json()[0]['summary_text']
    
    # Return error message if API call fails
    return 'Error summarizing text'

@summarize_bp.route('/', methods=['POST'])
@token_required
def summarize():
    try:
        # ADDED: Debug logging to track request
        print("Received summarize request")
        print("Headers:", request.headers)
        print("Data:", request.get_json())
        
        data = request.get_json()
        if not data:
            # ADDED: Debug logging for data validation
            print("No data provided")
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        if 'text' not in data:
            # ADDED: Debug logging for text field validation
            print("Text field missing")
            return jsonify({'success': False, 'message': 'Text is required'}), 400
        
        text = data['text']
        if not text or not text.strip():  # MODIFIED: Added 'not text' check
            print("Empty text provided")
            return jsonify({'success': False, 'message': 'Text cannot be empty'}), 400
        
        # ADDED: Debug logging for API call
        print("Calling Hugging Face API")
        summary = summarize_text(text)
        print("Summary received:", summary)
        
        if summary == 'Error summarizing text':
            print("Failed to generate summary")
            return jsonify({
                'success': False,
                'message': 'Failed to generate summary'
            }), 500
        
        # ADDED: Database storage for summaries
        try:
            conn = get_db_connection()
            c = conn.cursor()
            c.execute(
                'INSERT INTO summaries (user_id, original_text, summary) VALUES (?, ?, ?)',
                (request.user_id, text, summary)
            )
            conn.commit()
        except Exception as db_error:
            print(f"Database error: {str(db_error)}")
        finally:
            if 'conn' in locals():
                conn.close()
        
        return jsonify({
            'success': True,
            'summary': summary
        }), 200
        
    except Exception as e:
        # ADDED: Better error logging
        print(f"Error in summarize endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500

@summarize_bp.route('/history', methods=['GET'])
@token_required
def history():
    """
    Endpoint to retrieve user's summarization history
    Requires user authentication
    
    Returns:
        JSON response with list of past summaries
    """
    # Establish database connection
    conn = get_db_connection()
    c = conn.cursor()

        # Retrieve all summaries for the authenticated user
        # Ordered by creation time, most recent first
    try:
        c.execute('SELECT * FROM summaries WHERE user_id =? ORDER BY created_ai DESC',(request.user_id,)) #The comma after request.user_id creates a single-item tuple

    #convert database rows to list of dictionaries
        summaries = [dict(row) for row in c.fetchall()]
    finally:
        conn.close()

    #return summaries to client

    return jsonify(summaries),200



