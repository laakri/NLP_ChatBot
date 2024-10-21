from flask import Flask, request, jsonify
from flask_cors import CORS
from nlp_processor import preprocess_text, classify_emotion
from response_generator import generate_response, update_conversation_history
from emotion_tracker import update_emotion_history
import os
import firebase_admin
from firebase_admin import credentials, firestore
from chat_processor import process_chat  # Add this import
import logging

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Initialize Firebase
cred = credentials.Certificate("echosoul-key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

conversation_history = []

@app.route('/api/chat', methods=['POST'])
def chat():
    user_input = request.json['message']
    chat_id = request.json.get('chat_id')
    
    # Preprocess the user input
    processed_input = preprocess_text(user_input)
    
    # Classify the emotion
    emotion, emotion_scores = classify_emotion(processed_input)
    
    # Fetch chat history if chat_id is provided
    chat_history = []
    if chat_id:
        chat_ref = db.collection('chats').document(chat_id)
        messages = chat_ref.collection('messages').order_by('timestamp', direction=firestore.Query.DESCENDING).limit(5).get()
        chat_history = [msg.to_dict() for msg in messages][::-1]  # Reverse to get chronological order
    
    # Generate a response
    response = generate_response(processed_input, emotion, chat_history)
    
    # Create a new chat or use existing one
    if not chat_id:
        chat_ref = db.collection('chats').document()
        chat_id = chat_ref.id
    else:
        chat_ref = db.collection('chats').document(chat_id)
    
    # Update the chat's last_updated timestamp
    chat_ref.set({
        'last_updated': firestore.SERVER_TIMESTAMP
    }, merge=True)
    
    # Save the message in the chat's messages subcollection
    message_ref = chat_ref.collection('messages').document()
    message_ref.set({
        'user_input': user_input,
        'bot_response': response,
        'emotion': emotion,
        'emotion_scores': emotion_scores,
        'timestamp': firestore.SERVER_TIMESTAMP
    })
    
    return jsonify({
        'response': response,
        'emotion': emotion,
        'emotion_scores': emotion_scores,
        'chat_id': chat_id
    })

@app.route('/api/conversation_history', methods=['GET'])
def get_conversation_history():
    conversations = db.collection('conversations').order_by('timestamp', direction=firestore.Query.DESCENDING).limit(10).get()
    history = []
    for conv in conversations:
        history.append(conv.to_dict())
    return jsonify(history)

@app.route('/api/chat/<chat_id>/messages', methods=['GET'])
def get_chat_messages(chat_id):
    chat_ref = db.collection('chats').document(chat_id)
    messages = chat_ref.collection('messages').order_by('timestamp').get()
    
    message_list = []
    for message in messages:
        message_data = message.to_dict()
        message_list.append({
            'user_input': message_data['user_input'],
            'bot_response': message_data['bot_response'],
            'emotion': message_data['emotion'],
            'timestamp': message_data['timestamp']
        })
    
    return jsonify(message_list)

@app.route('/api/chat/<chat_id>', methods=['DELETE'])
def delete_chat(chat_id):
    try:
        # Get the chat reference
        chat_ref = db.collection('chats').document(chat_id)
        
        # Delete all messages in the chat's messages subcollection
        messages = chat_ref.collection('messages').get()
        for msg in messages:
            msg.reference.delete()
        
        # Delete the chat document itself
        chat_ref.delete()
        
        return jsonify({"success": True, "message": "Chat deleted successfully"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    
@app.route('/api/chats', methods=['GET'])
def get_chats():
    chats = db.collection('chats').order_by('last_updated', direction=firestore.Query.DESCENDING).get()
    
    chat_list = []
    for chat in chats:
        chat_data = chat.to_dict()
        chat_list.append({
            'id': chat.id,
            'last_updated': chat_data['last_updated']
        })
    
    return jsonify(chat_list)

# Add this new route
@app.route('/api/process_chat/<chat_id>', methods=['GET'])
def process_chat_recommendation(chat_id):
    try:
        recommendations = process_chat(chat_id)
        if isinstance(recommendations, dict) and "error" in recommendations:
            logging.error(f"Error in process_chat: {recommendations['error']}")
            return jsonify(recommendations), 500
        return jsonify(recommendations)
    except Exception as e:
        logging.error(f"Error in process_chat_recommendation: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)