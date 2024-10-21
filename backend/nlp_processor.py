import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import numpy as np
from transformers import BertTokenizer, BertForSequenceClassification, pipeline

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english')) - {'down', 'up', 'on', 'off', 'no', 'not'}

# Define a mapping from label indices to emotion names
label_to_emotion = {
    'LABEL_0': 'joy',
    'LABEL_1': 'sadness',
    'LABEL_2': 'anger',
    'LABEL_3': 'fear'
}

def load_model():
    model_path = 'models/emotion_model'
    tokenizer = BertTokenizer.from_pretrained(model_path)
    emotion_model = BertForSequenceClassification.from_pretrained(model_path)
    return tokenizer, emotion_model

def preprocess_text(text):
    tokens = word_tokenize(text.lower())
    return ' '.join([lemmatizer.lemmatize(token) for token in tokens if token not in stop_words or token.isalpha()])

def classify_emotion(text):
    tokenizer, emotion_model = load_model()
    processed_text = preprocess_text(text)
    
    emotion_classifier = pipeline('text-classification', model=emotion_model, tokenizer=tokenizer, top_k=None)
    results = emotion_classifier(processed_text)[0]
    
    # Create a dictionary of emotion scores
    emotion_scores = {label_to_emotion[result['label']]: result['score'] for result in results}
    
    # Get the emotion with the highest score
    best_result = max(results, key=lambda x: x['score'])
    emotion_name = label_to_emotion.get(best_result['label'], 'unknown')
    
    # Manual override if the input explicitly mentions an emotion
    if "angry" in text.lower() and label_to_emotion['LABEL_2'] == 'anger':
        if results[2]['score'] > 0.2:  # Example threshold
            emotion_name = 'anger'
     
    elif "sad" in text.lower() and label_to_emotion['LABEL_1'] == 'sadness':
        if results[1]['score'] > 0.2:  # Example threshold
            emotion_name = 'sadness'
            
    return emotion_name, emotion_scores


