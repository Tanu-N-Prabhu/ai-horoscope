import nltk
from flask import Flask, request, jsonify
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import os

# Manually set nltk data path to local directory
nltk.data.path.append(os.path.join(os.path.dirname(__file__), "nltk_data"))
print(nltk.data.path)
sia = SentimentIntensityAnalyzer()

app = Flask(__name__)

@app.route("/api/analyze", methods=["POST"])
def analyze_sentiment():
    try:
        data = request.get_json()
        if not data or "text" not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data["text"]
        print(f"Text received: {text}")  # Debugging log

        sentiment_score = sia.polarity_scores(text)["compound"]
        
        if sentiment_score >= 0.05:
            sentiment = "Positive 😊"
        elif sentiment_score <= -0.05:
            sentiment = "Negative 😞"
        else:
            sentiment = "Neutral 😐"

        return jsonify({"sentiment": sentiment})
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
