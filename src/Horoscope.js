import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Horoscope = () => {
  const { sign } = useParams();
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://api.aistrology.beandev.xyz/latest")
      .then(response => {
        const data = response.data.find(item => item.sign.toLowerCase() === sign.toLowerCase());
        setHoroscope(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching horoscope:", error);
        setLoading(false);
      });
  }, [sign]);

  if (loading) return <p>Loading...</p>;
  if (!horoscope) return <p>Horoscope not found for {sign}.</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🔮 {horoscope.sign.toUpperCase()} Horoscope 🔮</h2>
      <p><strong>Date:</strong> {horoscope.current_date}</p>
      <p><strong>Description:</strong> {horoscope.description}</p>
      <p><strong>Compatibility:</strong> {horoscope.compatibility}</p>
      <p><strong>Mood:</strong> {horoscope.mood}</p>
      <p><strong>Color:</strong> {horoscope.color}</p>
      <p><strong>Lucky Number:</strong> {horoscope.lucky_number}</p>
      <p><strong>Lucky Time:</strong> {horoscope.lucky_time}</p>

      <Link to="/">
        <button style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}>
          🔙 Back to Home
        </button>
      </Link>
    </div>
  );
};

export default Horoscope;
