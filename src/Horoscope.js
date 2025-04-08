import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./horoscope.css"; // Import CSS for styling

const Horoscope = () => {
  const { sign } = useParams();
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sentiment, setSentiment] = useState("");
  const [mindfulnessContent, setMindfulnessContent] = useState({
    affirmation: "",
    breathingExercise: "",
    musicPlaylist: "",
  });

  // Map sentiment to mindfulness content
  const getMindfulnessContent = (sentiment) => {
    switch (sentiment) {
      case "Very Positive 😊":
        return {
          affirmation: "You are full of positive energy. Keep shining!",
          breathingExercise: "Take a deep breath and relax. Inhale deeply, hold for 4 seconds, exhale for 4 seconds.",
          musicPlaylist: "https://www.youtube.com/playlist?list=PLz2R5ZGQW8-V9c0gS8UPZGQC0uIclPjsE", // Example YouTube playlist
        };
      case "Positive 🙂":
        return {
          affirmation: "Your efforts are bringing positive results. Stay focused and keep going!",
          breathingExercise: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds. Repeat.",
          musicPlaylist: "https://www.youtube.com/playlist?list=PLz2R5ZGQW8-VwfmFgMTeUPQdmlS0GZgl7", // Example YouTube playlist
        };
      case "Neutral 😐":
        return {
          affirmation: "Take a moment to reflect. Everything will fall into place.",
          breathingExercise: "Breathe in slowly for 5 seconds, breathe out for 5 seconds. Focus on your breath.",
          musicPlaylist: "https://www.youtube.com/playlist?list=PLz2R5ZGQW8-Vv0JZ-Tlr1ENgf6xZtRfi2", // Example YouTube playlist
        };
      case "Mildly Challenging 😕":
        return {
          affirmation: "You are strong and capable of overcoming any challenges. Take it one step at a time.",
          breathingExercise: "Inhale deeply for 4 seconds, hold for 4 seconds, exhale for 6 seconds.",
          musicPlaylist: "https://www.youtube.com/playlist?list=PLz2R5ZGQW8-Vfhwd9akKGGUexgs7onmso", // Example YouTube playlist
        };
      case "Room for Improvement 🙌":
        return {
          affirmation: "Mistakes are lessons. Every step forward counts.",
          breathingExercise: "Slow down your breathing. Inhale deeply for 3 seconds, exhale slowly for 5 seconds.",
          musicPlaylist: "https://www.youtube.com/playlist?list=PLz2R5ZGQW8-Vn8Fv0wKvgaDwe46jxVtLJ", // Example YouTube playlist
        };
      case "Very Challenging ⚡️":
        return {
          affirmation: "Stay calm, and remember that you can handle anything that comes your way.",
          breathingExercise: "Inhale for 3 seconds, exhale for 5 seconds. Repeat 5 times to calm your mind.",
          musicPlaylist: "https://www.youtube.com/playlist?list=PLz2R5ZGQW8-V6n5XybltWzL3OBLlz2iYX", // Example YouTube playlist
        };
      default:
        return {
          affirmation: "Take a deep breath and stay grounded.",
          breathingExercise: "Focus on your breath for a few moments to clear your mind.",
          musicPlaylist: "https://www.youtube.com/playlist?list=PLz2R5ZGQW8-VnTzWcpsPaxqppg3ISJx1Q", // Example YouTube playlist
        };
    }
  };

  // Wrap analyzeSentiment with useCallback
  const analyzeSentiment = useCallback((text) => {
    console.log("Text sent for sentiment analysis:", text); // Log the text before sending

    axios.post("https://ai-horoscope-nu.vercel.app/api/analyze", { text })
      .then(response => {
        console.log("Sentiment API Response:", response.data); // Log the API response
        setSentiment(response.data.sentiment);
        const content = getMindfulnessContent(response.data.sentiment); // Get the mindfulness content based on sentiment
        setMindfulnessContent(content); // Set mindfulness content
      })
      .catch(error => console.error("Error analyzing sentiment:", error));
  }, []); // Empty dependency array so it only gets created once

  useEffect(() => {
    axios.get("https://api.aistrology.beandev.xyz/latest")
      .then(response => {
        const data = response.data.find(item => item.sign.toLowerCase() === sign.toLowerCase());
        setHoroscope(data);
        
        if (data && data.description) {
          analyzeSentiment(data.description);
        } else {
          console.error("Description not available.");
        }

        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching horoscope:", error);
        setLoading(false);
      });
  }, [sign, analyzeSentiment]);  // No need to worry about missing dependencies anymore

  if (loading) {
    return (
      <div className="centered-message">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!horoscope) {
    return (
      <div className="centered-message">
        <p>❌ Horoscope not found for {sign}.</p>
      </div>
    );
  }

  return (
    <div className="horoscope-container">
      <div className="center-box">
        <div className="zodiac-header-box">
          <img
            src={`/zodiac-icons/${sign.toLowerCase()}.png`}
            alt={sign}
            className="zodiac-icon"
          />
          <h2 className="horoscope-title">
            {horoscope.sign.toUpperCase()}
          </h2>
        </div>
      </div>

      <div className="horoscope-card">
        <p><strong>Date:</strong> {horoscope.current_date}</p>
        <p><strong>Description:</strong> {horoscope.description}</p>
        <p><strong>Sentiment:</strong> {sentiment}</p>
        <p><strong>Compatibility:</strong> {horoscope.compatibility}</p>
        <p><strong>Mood:</strong> {horoscope.mood}</p>
        <p><strong>Color:</strong> {horoscope.color}</p>
        <p><strong>Lucky Number:</strong> {horoscope.lucky_number}</p>
        <p><strong>Lucky Time:</strong> {horoscope.lucky_time}</p>

        {/* Display the mindfulness content */}
        <div className="mindfulness-container">
          <h3>Mindfulness Companion</h3>
          <p><strong>Affirmation:</strong> {mindfulnessContent.affirmation}</p>
          <p><strong>Breathing Exercise:</strong> {mindfulnessContent.breathingExercise}</p>
          <p><strong>Music Playlist:</strong> <a href={mindfulnessContent.musicPlaylist} target="_blank" rel="noopener noreferrer">Listen Here</a></p>
        </div>
      </div>

      <Link to="/">
        <button className="back-button">Back to Home</button>
      </Link>
    </div>
  );
};

export default Horoscope;
