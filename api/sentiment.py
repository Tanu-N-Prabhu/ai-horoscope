from flask import Flask, request, jsonify
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

app = Flask(__name__)

@app.route("/api/analyze", methods=["POST"])
def analyze_sentiment():
    # Ensure the lexicon is downloaded inside the function
    nltk.download("vader_lexicon")
    sia = SentimentIntensityAnalyzer()

    # Get JSON data from the request
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

if __name__ == "__main__":
    app.run(debug=True)
