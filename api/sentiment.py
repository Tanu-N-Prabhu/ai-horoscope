import random
import nltk
from flask import Flask, request, jsonify
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import os

# Manually set nltk data path to local directory
nltk.data.path.append(os.path.join(os.path.dirname(__file__), "nltk_data"))
print(nltk.data.path)
sia = SentimentIntensityAnalyzer()

app = Flask(__name__)

# # Define mindfulness resources based on sentiment
# mindfulness_resources = {
#     "Very Positive 😊": {
#         "affirmation": "You are radiating positive energy! Keep shining!",
#         "breathing_exercise": "Take a deep breath in for 4 seconds, hold for 4 seconds, exhale for 4 seconds. Repeat 3 times.",
#         "music_playlist": "https://www.youtube.com/watch?v=8hLPQISNKH8"  # A happy song
#     },
#     "Positive 🙂": {
#         "affirmation": "You are on the right path, and good things are coming your way.",
#         "breathing_exercise": "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds. Repeat.",
#         "music_playlist": "https://www.youtube.com/watch?v=U9gY4gYft8c"  # Uplifting playlist
#     },
#     "Neutral 😐": {
#         "affirmation": "It’s okay to feel balanced. Take a moment to focus on your breath.",
#         "breathing_exercise": "Take a deep breath in, hold for 5 seconds, and release slowly. Repeat 5 times.",
#         "music_playlist": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"  # Relaxing playlist
#     },
#     "Mildly Challenging 😕": {
#         "affirmation": "Challenges are temporary, and you have the strength to overcome them.",
#         "breathing_exercise": "Breathe in for 5 seconds, hold for 5 seconds, breathe out slowly. Repeat 3 times.",
#         "music_playlist": "https://www.youtube.com/watch?v=lK-XFJkldX8"  # Calming music
#     },
#     "Room for Improvement 🙌": {
#         "affirmation": "Growth happens through challenges. You’re learning and evolving.",
#         "breathing_exercise": "Try box breathing: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat 4 times.",
#         "music_playlist": "https://www.youtube.com/watch?v=FzyCq9xwOeg"  # Meditative music
#     },
#     "Very Challenging ⚡️": {
#         "affirmation": "This too shall pass. You have the strength to overcome anything.",
#         "breathing_exercise": "Focus on your breath. Inhale deeply for 6 seconds, hold for 6 seconds, and exhale for 6 seconds.",
#         "music_playlist": "https://www.youtube.com/watch?v=Y4rjJKNW3nI"  # Soothing music
#     }
# }

# Mindfulness content pool for different sentiments
mindfulness_resources = {
    "Very Positive 😊": {
        "affirmations": [
            "You are radiating positive energy! Keep shining!",
            "Your light uplifts everyone around you.",
            "You are a beacon of joy — never dim your glow."
        ],
        "breathing_exercises": [
            "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds. Repeat 3 times.",
            "Breathe in joy, Inhale for 3 seconds, hold for 3 seconds, and exhale out gratitude for 3 seconds. Repeat 2 times.",
            "Smile as you inhale deeply for 5, hold for 5 seconds, and exhale for 5 seconds with peace."
        ],
        "music_playlists": [
            "https://www.youtube.com/watch?v=8hLPQISNKH8",
            "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
            "https://www.youtube.com/watch?v=l482T0yNkeo"
        ]
    },
    "Positive 🙂": {
        "affirmations": [
            "You are on the right path, and good things are coming your way.",
            "Every small step forward is progress. Keep moving!",
            "Your mindset is your superpower — use it wisely."
        ],
        "breathing_exercises": [
            "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds. Repeat 3 times.",
            "Close your eyes and take three mindful breaths, Inhale for 6 seconds, Hold for 6 seconds and exhale for 6 seconds — slowly and deeply.",
            "Breathe in confidence, Inhale for 5 seconds, hold for 8 seconds, exhale doubt for 5 seconds."
        ],
        "music_playlists": [
            "https://www.youtube.com/watch?v=U9gY4gYft8c",
            "https://www.youtube.com/watch?v=QGJuMBdaqIw",
            "https://www.youtube.com/watch?v=OPf0YbXqDm0"
        ]
    },
    "Neutral 😐": {
        "affirmations": [
            "Even stillness is part of the journey.",
            "You are doing enough, even when it feels like you're not.",
            "Clarity comes in calm moments — trust the pause."
        ],
        "breathing_exercises": [
            "Inhale deeply for 4 seconds, hold for 4, exhale for 4. Repeat 3 times.",
            "Focus on your breath, inhale for 8 seconds, hold for 5 seconds and exhale for 8 seconds — nothing else matters for the next minute.",
            "Breathe naturally and place your hand on your heart. Feel grounded. Inhale for 3 seconds, Hold for 3 seconds and Exhale for 3 seconds. Repeat 4 times."
        ],
        "music_playlists": [
            "https://www.youtube.com/watch?v=lFcSrYw-ARY",
            "https://www.youtube.com/watch?v=5DiMoehAeOU",
            "https://www.youtube.com/watch?v=2OEL4P1Rz04"
        ]
    },
    "Mildly Challenging 😕": {
        "affirmations": [
            "You have overcome tough times before — you will again.",
            "It’s okay to have off days. Be kind to yourself.",
            "You are not alone — take it one breath at a time."
        ],
        "breathing_exercises": [
            "Box breathing: Inhale 4 seconds, hold 4 seconds, exhale 4 seconds.",
            "Put one hand on your chest and the other on your belly. Breathe deeply, Inhale 6 seconds, hold 6 seconds, exhale 6 seconds.",
            "Inhale slowly for 5 seconds, Hold for 5 seconds and count your blessings as you exhale for 5 seconds."
        ],
        "music_playlists": [
            "https://www.youtube.com/watch?v=1ZYbU82GVz4",
            "https://www.youtube.com/watch?v=2OEL4P1Rz04",
            "https://www.youtube.com/watch?v=lFcSrYw-ARY"
        ]
    },
    "Room for Improvement 🙌": {
        "affirmations": [
            "Every setback is a setup for a comeback.",
            "You are stronger than your current situation.",
            "This moment doesn’t define you — your response does."
        ],
        "breathing_exercises": [
            "Breathe in courage, breathe out fear. Inhale 4 seconds, hold 4 seconds, exhale 4 seconds.",
            "Deep breathing. Inhale 5 seconds, hold 5 seconds, exhale 5 seconds, do with affirmations: 'I am safe. I am strong.'",
            "Use 4-7-8 breathing: Inhale 4 seconds, hold 7 seconds, exhale 8 seconds."
        ],
        "music_playlists": [
            "https://www.youtube.com/watch?v=1ZYbU82GVz4",
            "https://www.youtube.com/watch?v=kXYiU_JCYtU",  # Linkin Park – motivational rock
            "https://www.youtube.com/watch?v=ktvTqknDobU"   # Imagine Dragons – Rise up feel
        ]
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

    affirmation = random.choice(mindfulness.get("affirmations", ["You are doing your best."]))
    breathing = random.choice(mindfulness.get("breathing_exercises", ["Breathe in deeply."]))
    music = random.choice(mindfulness.get("music_playlists", ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]))

    # return jsonify({
    #     "sentiment": sentiment,
    #     "affirmation": mindfulness.get("affirmation", ""),
    #     "breathing_exercise": mindfulness.get("breathing_exercise", ""),
    #     "music_playlist": mindfulness.get("music_playlist", "")
    # })

    return jsonify({
        "sentiment": sentiment,
        "affirmation": affirmation,
        "breathing_exercise": breathing,
        "music_playlist": music
    })

if __name__ == "__main__":
    app.run(debug=True)
