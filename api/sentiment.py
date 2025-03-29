from flask import Flask, request, jsonify
from flask_cors import CORS
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk

nltk.download("vader_lexicon")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
sia = SentimentIntensityAnalyzer()

@app.route("/api/analyze", methods=["POST"])
def analyze_sentiment():
    try:
        data = request.json
        text = data.get("text", "")

        if not text:
            return jsonify({"error": "No text provided"}), 400

        sentiment_score = sia.polarity_scores(text)["compound"]

        if sentiment_score >= 0.05:
            sentiment = "Positive 😊"
        elif sentiment_score <= -0.05:
            sentiment = "Negative 😞"
        else:
            sentiment = "Neutral 😐"

        return jsonify({"sentiment": sentiment})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
