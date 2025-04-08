import nltk
from flask import Flask, request, jsonify
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import os

# Manually set nltk data path to local directory
nltk.data.path.append(os.path.join(os.path.dirname(__file__), "nltk_data"))
print(nltk.data.path)
sia = SentimentIntensityAnalyzer()

app = Flask(__name__)

# Define mindfulness resources based on sentiment
mindfulness_resources = {
    "Very Positive 😊": {
        "affirmation": "You are radiating positive energy! Keep shining!",
        "breathing_exercise": "Take a deep breath in for 4 seconds, hold for 4 seconds, exhale for 4 seconds. Repeat 3 times.",
        "music_playlist": "https://www.youtube.com/watch?v=8hLPQISNKH8"  # A happy song
    },
    "Positive 🙂": {
        "affirmation": "You are on the right path, and good things are coming your way.",
        "breathing_exercise": "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds. Repeat.",
        "music_playlist": "https://www.youtube.com/watch?v=U9gY4gYft8c"  # Uplifting playlist
    },
    "Neutral 😐": {
        "affirmation": "It’s okay to feel balanced. Take a moment to focus on your breath.",
        "breathing_exercise": "Take a deep breath in, hold for 5 seconds, and release slowly. Repeat 5 times.",
        "music_playlist": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"  # Relaxing playlist
    },
    "Mildly Challenging 😕": {
        "affirmation": "Challenges are temporary, and you have the strength to overcome them.",
        "breathing_exercise": "Breathe in for 5 seconds, hold for 5 seconds, breathe out slowly. Repeat 3 times.",
        "music_playlist": "https://www.youtube.com/watch?v=lK-XFJkldX8"  # Calming music
    },
    "Room for Improvement 🙌": {
        "affirmation": "Growth happens through challenges. You’re learning and evolving.",
        "breathing_exercise": "Try box breathing: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat 4 times.",
        "music_playlist": "https://www.youtube.com/watch?v=FzyCq9xwOeg"  # Meditative music
    },
    "Very Challenging ⚡️": {
        "affirmation": "This too shall pass. You have the strength to overcome anything.",
        "breathing_exercise": "Focus on your breath. Inhale deeply for 6 seconds, hold for 6 seconds, and exhale for 6 seconds.",
        "music_playlist": "https://www.youtube.com/watch?v=Y4rjJKNW3nI"  # Soothing music
    }
}

@app.route("/api/analyze", methods=["POST"])
def analyze_sentiment():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    sentiment_score = sia.polarity_scores(text)["compound"]

    if sentiment_score >= 0.5:
        sentiment = "Very Positive 😊"
    elif sentiment_score >= 0.05:
        sentiment = "Positive 🙂"
    elif sentiment_score >= -0.05:
        sentiment = "Neutral 😐"
    elif sentiment_score >= -0.3:
        sentiment = "Mildly Challenging 😕"
    elif sentiment_score >= -0.5:
        sentiment = "Room for Improvement 🙌"
    else:
        sentiment = "Very Challenging ⚡️"

    # Get the mindfulness resources for the sentiment
    mindfulness = mindfulness_resources.get(sentiment, {})

    return jsonify({
        "sentiment": sentiment,
        "affirmation": mindfulness.get("affirmation", ""),
        "breathing_exercise": mindfulness.get("breathing_exercise", ""),
        "music_playlist": mindfulness.get("music_playlist", "")
    })

if __name__ == "__main__":
    app.run(debug=True)
