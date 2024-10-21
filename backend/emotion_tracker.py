import json
from datetime import datetime
from transformers import BertTokenizer, BertForSequenceClassification, pipeline

# Load the trained model
model_path = 'models/emotion_model'
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)

# Create a pipeline for emotion classification
emotion_classifier = pipeline('text-classification', model=model, tokenizer=tokenizer)

# Define a mapping from label indices to emotion names
label_to_emotion = {
    'LABEL_0': 'joy',
    'LABEL_1': 'sadness',
    'LABEL_2': 'anger',
    'LABEL_3': 'fear'
}

emotion_history = []

def update_emotion_history(text):
    # Use the model to predict the emotion
    emotion = classify_emotion(text)
    
    emotion_history.append({
        'emotion': emotion,
        'timestamp': datetime.now().isoformat()
    })
    
    # Keep only the last 10 entries
    if len(emotion_history) > 10:
        emotion_history.pop(0)
    
    # Save the emotion history to a file
    with open('data/emotion_history.json', 'w') as f:
        json.dump(emotion_history, f)
    
    return emotion

def classify_emotion(text):
    result = emotion_classifier(text)[0]
    emotion_label = result['label']
    emotion_name = label_to_emotion.get(emotion_label, 'unknown')
    return emotion_name

