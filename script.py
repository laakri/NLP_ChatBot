import os
from dotenv import load_dotenv
import google.generativeai as genai

   # Load environment variables from .env file
load_dotenv()

   # Configure the Gemini API
genai.configure(api_key=os.environ["API_KEY"])

   # Test the API
try:
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("Write a story about a magic backpack.")
    print("Generated Text:", response.text)
except Exception as e:
    print(f"Error: {e}")