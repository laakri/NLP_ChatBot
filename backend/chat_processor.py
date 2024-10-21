import google.generativeai as genai
from firebase_admin import firestore
import os
from dotenv import load_dotenv
import logging
import json
import re

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)

# Configure the Gemini API
genai.configure(api_key=os.environ["API_KEY"])

def extract_json_from_response(response_text):
    # Use regex to find JSON content between triple backticks
    match = re.search(r'```json\s*([\s\S]*?)\s*```', response_text)
    if match:
        return match.group(1)
    return response_text  # Return the original text if no JSON block is found

def process_chat(chat_id):
    try:
        db = firestore.client()
        chat_ref = db.collection('chats').document(chat_id)
        messages = chat_ref.collection('messages').order_by('timestamp').get()

        chat_history = []
        for message in messages:
            message_data = message.to_dict()
            chat_history.append(f"User: {message_data['user_input']}")
            chat_history.append(f"Bot: {message_data['bot_response']}")

        chat_text = "\n".join(chat_history)

        logging.info(f"Chat history retrieved for chat_id: {chat_id}")
        logging.info(f"Chat history: {chat_text}")

        prompt = f"""
        Based on the following chat history, provide recommendations for music, movies, books, and activities. Also, give a brief emotion summary of the conversation.

        Chat History:
        {chat_text}

        Please provide the following:
        1. Emotion Summary
        2. Music Recommendations (5 items)
        3. Movie Recommendations (5 items)
        4. Book Recommendations (5 items)
        5. Activity Suggestions (5 items)

        Format the response as a JSON object without any markdown formatting.
        """

        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)

        logging.info(f"Gemini API response: {response.text}")

        # Extract JSON from the response
        json_content = extract_json_from_response(response.text)
        
        # Remove any remaining backticks and whitespace
        clean_response = json_content.strip('`').strip()
        
        recommendations = json.loads(clean_response)
        return recommendations
    except json.JSONDecodeError as e:
        logging.error(f"JSON parsing error: {str(e)}")
        logging.error(f"Problematic JSON string: {clean_response}")
        return {"error": f"Failed to parse API response: {str(e)}"}
    except Exception as e:
        logging.error(f"Error in process_chat: {str(e)}")
        return {"error": f"Failed to process chat and generate recommendations: {str(e)}"}