from transformers import BertTokenizer, BertForSequenceClassification, pipeline

# Load the trained model
model_path = 'models/emotion_model'
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)

# Create a pipeline for emotion classification
emotion_classifier = pipeline('text-classification', model=model, tokenizer=tokenizer)

# Test sentences
test_sentences = [
    "I'm feeling great today!",
    "This news is devastating.",
    "I can't believe how angry I am right now.",
    "I'm really worried about the future.",
    "I'm feeling really down today",
    "I feel bad"
]

# Predict emotions
for sentence in test_sentences:
    result = emotion_classifier(sentence)[0]
    print(f"Sentence: '{sentence}'")
    print(f"Predicted emotion: {result['label']}")
    print(f"Score: {result['score']:.4f}")
    print()