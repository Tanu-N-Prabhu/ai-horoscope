import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./horoscope.css"; // Import CSS for styling

const Horoscope = () => {
  const { sign } = useParams();
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sentiment, setSentiment] = useState("");
  const [affirmation, setAffirmation] = useState("");
  const [breathingExercise, setBreathingExercise] = useState("");
  const [musicPlaylist, setMusicPlaylist] = useState("");

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
  }, [sign]);

  const analyzeSentiment = (text) => {
    console.log("Text sent for sentiment analysis:", text); // Log the text before sending
  
    axios.post("https://ai-horoscope-nu.vercel.app/api/analyze", { text })
      .then(response => {
        console.log("Sentiment API Response:", response.data); // Log the API response
        const sentiment = response.data.sentiment;
        setSentiment(sentiment);
        generateMindfulnessContent(sentiment);
      })
      .catch(error => console.error("Error analyzing sentiment:", error));
  };

  const generateMindfulnessContent = (sentiment) => {
    switch (sentiment) {
      case "Very Positive 😊":
        setAffirmation("You are doing amazing! Keep shining!");
        setBreathingExercise("Try the 4-7-8 Breathing Exercise: Inhale for 4 seconds, hold for 7, and exhale for 8 seconds.");
        setMusicPlaylist("https://www.youtube.com/watch?v=3D0Tn2-7upI"); // Example YouTube link for positive mood playlist
        break;
      case "Positive 🙂":
        setAffirmation("Good things are coming your way. Stay positive!");
        setBreathingExercise("Take deep breaths in and out for a minute to refresh your mind.");
        setMusicPlaylist("https://www.youtube.com/watch?v=lzj_fFzT8Y4"); // Example YouTube link for calm playlist
        break;
      case "Neutral 😐":
        setAffirmation("Stay balanced and take things one step at a time.");
        setBreathingExercise("Focus on your breath. Inhale for 5 seconds, exhale for 5 seconds.");
        setMusicPlaylist("https://www.youtube.com/watch?v=8e8lX-U5G3w"); // Example YouTube link for meditation playlist
        break;
      case "Mildly Challenging 😕":
        setAffirmation("Challenges are opportunities for growth. You've got this!");
        setBreathingExercise("Try the Box Breathing technique: Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4.");
        setMusicPlaylist("https://www.youtube.com/watch?v=4nMRADcM3Y0"); // Example YouTube link for focus playlist
        break;
      case "Room for Improvement 🙌":
        setAffirmation("It's okay to not have everything figured out. Progress takes time.");
        setBreathingExercise("Slow down your breathing. Inhale deeply, hold for a few seconds, exhale slowly.");
        setMusicPlaylist("https://www.youtube.com/watch?v=Y9YnTtJcC8I"); // Example YouTube link for relaxation playlist
        break;
      case "Very Challenging ⚡️":
        setAffirmation("You are strong and capable of overcoming challenges. Take a moment to breathe.");
        setBreathingExercise("Do deep, slow breathing for 5 minutes. Focus on calming your mind.");
        setMusicPlaylist("https://www.youtube.com/watch?v=G-BQIrP-2XA"); // Example YouTube link for stress-relief playlist
        break;
      default:
        setAffirmation("Stay calm and positive. Everything will work out.");
        setBreathingExercise("Take a few moments to focus on your breathing.");
        setMusicPlaylist("https://www.youtube.com/watch?v=w5nLk4Y2F-0"); // Generic playlist
        break;
    }
  };

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
        <p><strong>Affirmation:</strong> {affirmation}</p>
        <p><strong>Breathing Exercise:</strong> {breathingExercise}</p>
        <p><strong>Music Playlist:</strong> <a href={musicPlaylist} target="_blank" rel="noopener noreferrer">Click here</a></p>
        <p><strong>Compatibility:</strong> {horoscope.compatibility}</p>
        <p><strong>Mood:</strong> {horoscope.mood}</p>
        <p><strong>Color:</strong> {horoscope.color}</p>
        <p><strong>Lucky Number:</strong> {horoscope.lucky_number}</p>
        <p><strong>Lucky Time:</strong> {horoscope.lucky_time}</p>
      </div>

      <Link to="/">
        <button className="back-button">Back to Home</button>
      </Link>
    </div>
  );
};

export default Horoscope;
