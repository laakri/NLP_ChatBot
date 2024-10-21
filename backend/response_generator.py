import json
import random
import re
import os
import google.generativeai as genai
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
load_dotenv()

# Configure the Gemini API
genai.configure(api_key=os.environ["API_KEY"])

# Load the chatbot data
with open('data/chatbot_data.json', 'r') as f:
    chatbot_data = json.load(f)
import logging
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO)

def generate_response(processed_input, emotion, chat_history):
    try:
        # Prepare the chat history for the prompt
        history_prompt = "\n".join([f"User: {msg['user_input']}\nBot: {msg['bot_response']}" for msg in chat_history])
        
        # Generate response using Gemini API
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""Chat History:
{history_prompt}

# Current Emotion: {emotion}
User: {processed_input}
Bot:"""
        
        logging.info(f"Sending prompt to Gemini API: {prompt}")
        response = model.generate_content(prompt)
        
        # Log the entire response object
        logging.info(f"Full response from Gemini API: {response}")
        
        # Access the text field from the response
        candidate = response.candidates[0]
        
        # Check for safety flags
        if candidate.finish_reason == "SAFETY":
            logging.warning("Response flagged for safety.")
            return "I'm sorry, I can't provide a response to that input."

        # Extract the text from the response
        text = candidate.content.parts[0].text
        
        # Format the response
        formatted_response = format_response(text)
        return formatted_response
    except AttributeError as e:
        logging.error(f"Attribute error: {e}")
        return "Sorry, there was an error processing the response."
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return "Sorry, I couldn't generate a response at the moment."


def format_response(text):
    # Split the response into paragraphs
    paragraphs = text.split('\n')
    
    formatted_paragraphs = []
    for paragraph in paragraphs:
        # Format bullet points
        if paragraph.strip().startswith('*'):
            formatted_paragraphs.append(paragraph.replace('*', '•'))
        else:
            # Format bold text
            formatted_paragraph = re.sub(r'\*\*(.*?)\*\*', r'**\1**', paragraph)
            formatted_paragraphs.append(formatted_paragraph)
    
    return '\n\n'.join(formatted_paragraphs)


def extract_keywords(text):
    # Simple keyword extraction (can be improved with NLP techniques)
    important_words = ['job', 'work', 'career', 'promotion', 'interview', 'hired', 'position']
    return [word for word in text.lower().split() if word in important_words]

def choose_response(responses, keywords):
    # Prioritize responses that match keywords
    matching_responses = [r for r in responses if any(keyword in r.lower() for keyword in keywords)]
    return random.choice(matching_responses) if matching_responses else random.choice(responses)

def choose_question(questions, keywords, conversation_history):
    # Prioritize questions that match keywords and haven't been asked before
    matching_questions = [q for q in questions if any(keyword in q.lower() for keyword in keywords) and q not in conversation_history]
    if matching_questions:
        return random.choice(matching_questions)
    else:
        # If no matching questions, choose any unasked question
        unasked_questions = [q for q in questions if q not in conversation_history]
        return random.choice(unasked_questions) if unasked_questions else random.choice(questions)

def update_conversation_history(conversation_history, question):
    conversation_history.append(question)
    if len(conversation_history) > 5:  # Keep only the last 5 questions
        conversation_history.pop(0)
    return conversation_history