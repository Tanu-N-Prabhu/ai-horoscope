import React from "react";
import { Link } from "react-router-dom";

const zodiacSigns = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

const Home = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🌟 AI Horoscope 🌟</h1>
      <p>Select your zodiac sign to see today's horoscope:</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        {zodiacSigns.map((sign) => (
          <Link key={sign} to={`/horoscope/${sign}`} style={{ textDecoration: "none", fontSize: "18px" }}>
            <button style={{ padding: "10px", cursor: "pointer" }}>{sign.toUpperCase()}</button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
