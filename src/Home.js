import './dark-mode.css';  // Import dark mode styles

import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Modal } from "react-bootstrap";  // Import necessary components
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react"; // Import icons for expand/collapse
import Header from "./Header"; // Import the Header component

const zodiacSigns = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);  // State for showing changelog
  const [changelogData, setChangelogData] = useState([]);  // State to hold the changelog data
  const [expandedVersion, setExpandedVersion] = useState(null); // Track expanded changelog version

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const response = await fetch("changelog.json");
        const data = await response.json();
        console.log("Changelog Data Length:", data.length);
        console.log(data)
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by latest date
        setChangelogData(sortedData);
        if (sortedData.length > 0) {
          setExpandedVersion(sortedData[0].version); // Expand latest version by default
        }
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

  const toggleVersion = (version) => {
    setExpandedVersion(expandedVersion === version ? null : version);
  };

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
                <h5 
                  onClick={() => toggleVersion(version.version)} 
                  style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  Version {version.version} ({version.date})
                  {expandedVersion === version.version ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </h5>
                {expandedVersion === version.version && (
                  <>
                    <h6>New Features:</h6>
                    <ul style={{ textAlign: "justify" }}>
                      {version.changes.map((change, idx) => (
                        <li key={idx}>{change}</li>
                      ))}
                    </ul>
                    <h6>Bug Fixes & Enhancements:</h6>
                    <ul style={{ textAlign: "justify" }}>
                      {version.bugFixes.map((bug, idx) => (
                        <li key={idx}>{bug}</li>
                      ))}
                    </ul>
                    <hr />
                  </>
                )}
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
      {/* Zodiac Signs List in Card View */}
<Container className="py-5">
  <Row className="justify-content-center">
    {zodiacSigns.map((sign) => (
      <Col key={sign} xs={12} sm={6} md={4} lg={3} className="mb-4">
        <Link to={`/horoscope/${sign}`} style={{ textDecoration: "none" }}>
          <div className="zodiac-card">
            <div className="zodiac-card-body">
              {/* Add the image dynamically based on the sign */}
              <img
                src={`/zodiac-icons/${sign}.png`}  // Make sure to have the images in the 'zodiac-icons' folder
                alt={sign}
                className="zodiac-image"  // Add a class for styling
              />
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
