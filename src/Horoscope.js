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

  const [timer, setTimer] = useState(0); // Timer state in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Timer running state
  const [phase, setPhase] = useState("inhale"); // Track current phase (inhale, hold, exhale)
  const [breathingSteps, setBreathingSteps] = useState({
    inhale: 0,
    hold: 0,
    exhale: 0,
  });

  // Extract inhale, hold, and exhale times from the breathing exercise string
  const extractBreathingTimes = (breathingText) => {
    const inhaleMatch = breathingText.match(/inhale for (\d+) seconds/i);
    const holdMatch = breathingText.match(/hold for (\d+) seconds/i);
    const exhaleMatch = breathingText.match(/exhale for (\d+) seconds/i);
    return {
      inhale: inhaleMatch ? parseInt(inhaleMatch[1], 10) : 4,
      hold: holdMatch ? parseInt(holdMatch[1], 10) : 4,
      exhale: exhaleMatch ? parseInt(exhaleMatch[1], 10) : 4,
    };
  };

  const handleTimerStart = () => {
    const { inhale, hold, exhale } = extractBreathingTimes(mindfulnessContent.breathingExercise);
    setBreathingSteps({ inhale, hold, exhale });
    setIsTimerRunning(true);
    setPhase("inhale");
    setTimer(inhale); // Start with inhale phase
  };

  const handleTimerReset = () => {
    setIsTimerRunning(false);
    setTimer(0);
  };


  // Timer logic
  // useEffect(() => {
  //   let interval;
  //   if (isTimerRunning && timer > 0) {
  //     interval = setInterval(() => {
  //       setTimer((prevTimer) => prevTimer - 1);
  //     }, 1000);
  //   } else if (timer === 0 && isTimerRunning) {
  //     handleTimerReset(); // Reset when timer reaches 0
  //   }

  //   return () => clearInterval(interval); // Cleanup interval
  // }, [isTimerRunning, timer]);
    // Timer logic for transitioning between phases
    useEffect(() => {
      if (isTimerRunning && timer > 0) {
        const interval = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
        return () => clearInterval(interval); // Cleanup interval
      } else if (timer === 0 && isTimerRunning) {
        if (phase === "inhale") {
          setPhase("hold");
          setTimer(breathingSteps.hold); // Switch to hold phase
        } else if (phase === "hold") {
          setPhase("exhale");
          setTimer(breathingSteps.exhale); // Switch to exhale phase
        } else {
          handleTimerReset(); // Reset after all phases are completed
        }
      }
    }, [isTimerRunning, timer, phase, breathingSteps]);
    
  const analyzeSentiment = useCallback((text) => {
    axios.post("https://ai-horoscope-nu.vercel.app/api/analyze", { text })
      .then(response => {
        setSentiment(response.data.sentiment);
        setMindfulnessContent({
          affirmation: response.data.affirmation,
          breathingExercise: response.data.breathing_exercise,
          musicPlaylist: response.data.music_playlist
        });
      })
      .catch(error => console.error("Error analyzing sentiment:", error));
  }, []);

  useEffect(() => {
    axios.get("https://api.aistrology.beandev.xyz/latest")
      .then(response => {
        const data = response.data.find(item => item.sign.toLowerCase() === sign.toLowerCase());
        setHoroscope(data);
        if (data && data.description) {
          analyzeSentiment(data.description);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching horoscope:", error);
        setLoading(false);
      });
  }, [sign, analyzeSentiment]);

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
          <h2 className="horoscope-title">{horoscope.sign.toUpperCase()}</h2>
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
        <div className="mindfulness-companion">
        <h3>Mindfulness Companion</h3>
        <p><strong>Affirmation:</strong> {mindfulnessContent.affirmation}</p>
        <p><strong>Breathing Exercise:</strong> {mindfulnessContent.breathingExercise}</p>
        
        {/* Start Timer Button */}
        <button className="breathing-exercise" onClick={handleTimerStart}>Start Breathing Exercise</button>

        {/* Animated Clock */}
        {isTimerRunning && (
          <div className={`breathing-clock ${phase}`}></div>
        )}

        {/* Timer Display */}
        {isTimerRunning && <p><strong>Timer: </strong>{timer} seconds remaining</p>}
        <p>{phase === 'inhale' ? 'Inhale' : phase === 'hold' ? 'Hold' : 'Exhale'}</p>


        <p><strong>Music Playlist:</strong> 
          <a href={mindfulnessContent.musicPlaylist} target="_blank" rel="noopener noreferrer">Listen Here</a>
        </p>
      </div>
      </div>

      <Link to="/">
        <button className="back-button">Back to Home</button>
      </Link>
    </div>
  );
};

export default Horoscope;
