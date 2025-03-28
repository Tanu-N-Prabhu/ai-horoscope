import React, { useEffect, useState } from "react";
import { getHoroscope } from "./api";

function App() {
  const [horoscope, setHoroscope] = useState("");

  useEffect(() => {
    const fetchHoroscope = async () => {
      const data = await getHoroscope("aries"); // Fetch Aries horoscope
      if (data) {
        setHoroscope(data.horoscope);
      }
    };
    fetchHoroscope();
  }, []);

  return (
    <div>
      <h1>AI Horoscope</h1>
      <p>{horoscope ? horoscope : "Loading horoscope..."}</p>
    </div>
  );
}

export default App;
