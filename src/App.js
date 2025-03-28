import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Horoscope from "./Horoscope";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/horoscope/:sign" element={<Horoscope />} />
      </Routes>
    </Router>
  );
}

export default App;
