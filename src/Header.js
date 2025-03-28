import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = ({ isDarkMode, toggleDarkMode, handleShowChangelog }) => {
  return (
    <Navbar
      bg={isDarkMode ? "dark" : "light"}
      variant={isDarkMode ? "dark" : "light"}
      expand="lg"
      className="mb-4" // Adding margin to the bottom for separation
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-uppercase font-weight-bold">
          🌟 AI Horoscope 🌟
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> {/* Adjusting the margin to the left for the nav items */}
            {/* Dark Mode Toggle Button */}
            <Button
              variant={isDarkMode ? "outline-light" : "outline-dark"}
              onClick={toggleDarkMode}
              className="mx-2"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Button>

            {/* Changelog Button */}
            <Button
              variant={isDarkMode ? "outline-light" : "outline-dark"}
              onClick={handleShowChangelog}
              className="mx-2"
            >
              View Changelog
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
