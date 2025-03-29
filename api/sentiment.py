from flask import Flask, request, jsonify
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk

# Download the VADER lexicon for sentiment analysis
nltk.download("vader_lexicon")

app = Flask(__name__)
sia = SentimentIntensityAnalyzer()

@app.route("/analyze", methods=["POST"])
def analyze_sentiment():
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

if __name__ == "__main__":
    app.run(debug=True)
