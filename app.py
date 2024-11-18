# app.py
from flask import Flask, render_template, request, jsonify
from elevenlabs import generate
import openai
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Load API keys from environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

@app.route('/')
def home():
    return render_template('morning_plan.html')

@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_message = request.json.get('message')
    # Generate a text response from OpenAI
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=user_message,
        max_tokens=150
    )
    ai_text_response = response.choices[0].text.strip()
    
    # Generate audio for the response using ElevenLabs
    audio_stream = generate(
        api_key=ELEVENLABS_API_KEY,
        text=ai_text_response,
        voice="Rachel",
        stream=True
    )
    audio_url = f"/play_audio?text={ai_text_response}"

    return jsonify({"text": ai_text_response, "audio_url": audio_url})

@app.route('/play_audio')
def play_audio():
    text = request.args.get('text')
    audio_stream = generate(api_key=ELEVENLABS_API_KEY, text=text, voice="Rachel", stream=True)
    return audio_stream, 200

if __name__ == "__main__":
    app.run(debug=True)
