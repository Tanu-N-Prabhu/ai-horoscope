import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./horoscope.css"; // Import CSS for styling

const Horoscope = () => {
  const { sign } = useParams();
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sentiment, setSentiment] = useState("");

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
        setSentiment(response.data.sentiment);
      })
      .catch(error => console.error("Error analyzing sentiment:", error));
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
