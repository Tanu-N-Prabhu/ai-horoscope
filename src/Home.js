import './dark-mode.css';  // Import dark mode styles

import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Modal } from "react-bootstrap";  // Import necessary components
import { Link } from "react-router-dom";
import Header from "./Header"; // Import the Header component

const zodiacSigns = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);  // State for showing changelog
  const [changelogData, setChangelogData] = useState([]);  // State to hold the changelog data

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const response = await fetch("changelog.json");
        const data = await response.json();
        setChangelogData(data);
      } catch (error) {
        console.error("Error fetching changelog data:", error);
      }
    };

    fetchChangelog();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
    localStorage.setItem("isDarkMode", JSON.stringify(!isDarkMode));  // Save the mode to localStorage
  };

  const handleShowChangelog = () => setShowChangelog(true);  // Show changelog
  const handleCloseChangelog = () => setShowChangelog(false); // Close changelog

  // Retrieve dark mode preference from localStorage
  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("isDarkMode"));
    if (savedMode !== null) {
      setIsDarkMode(savedMode);
      if (savedMode) document.body.classList.add("dark-mode");
      else document.body.classList.remove("dark-mode");
    }
  }, []);

  return (
    <div>
      {/* Responsive Header */}
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} handleShowChangelog={handleShowChangelog} />

      {/* Changelog Modal */}
      <Modal show={showChangelog} onHide={handleCloseChangelog}>
        <Modal.Header closeButton>
          <Modal.Title>Changelog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {changelogData.length > 0 ? (
            changelogData.map((version, index) => (
              <div key={index}>
                <h5>Version {version.version} ({version.date})</h5>
                <h6>Changes:</h6>
                <ul>
                  {version.changes.map((change, idx) => (
                    <li key={idx}>{change}</li>
                  ))}
                </ul>
                <h6>Bug Fixes:</h6>
                <ul>
                  {version.bugFixes.map((bug, idx) => (
                    <li key={idx}>{bug}</li>
                  ))}
                </ul>
                <hr />
              </div>
            ))
          ) : (
            <p>Loading changelog...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseChangelog}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Zodiac Signs List in Card View */}
      <Container className="py-5">
        <Row className="justify-content-center">
          {zodiacSigns.map((sign) => (
            <Col key={sign} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Link to={`/horoscope/${sign}`} style={{ textDecoration: "none" }}>
                <div className="zodiac-card">
                  <div className="zodiac-card-body">
                    <h5 className="zodiac-title">{sign.toUpperCase()}</h5>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
