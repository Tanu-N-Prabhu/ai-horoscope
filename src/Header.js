import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, Sun, History } from "lucide-react";

const Header = ({ isDarkMode, toggleDarkMode, handleShowChangelog }) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, delay: 0.2 }}
    >
      <Navbar
        bg={isDarkMode ? "dark" : "light"}
        variant={isDarkMode ? "dark" : "light"}
        expand="lg"
        className="mb-4 shadow-sm rounded"
        style={{
          transition: "all 0.3s ease-in-out",
          borderBottom: isDarkMode ? "1px solid #444" : "1px solid #ddd",
        }}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="text-uppercase fw-bold"
            style={{
              letterSpacing: "1px",
              fontSize: "1.2rem",
              color: isDarkMode ? "#f1f1f1" : "#222",
              transition: "color 0.3s ease-in-out",
            }}
          >
            🌟 AI Horoscope 🌟
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav
              className="ms-auto d-flex flex-column flex-lg-row align-items-center justify-content-lg-end gap-2 py-3 py-lg-0"
              style={{ width: "100%", textAlign: "center" }}
            >
              <div className="d-flex flex-column flex-lg-row align-items-center gap-2 w-100 w-lg-auto" style={{ maxWidth: "400px" }}>
                <Button
                  variant={isDarkMode ? "outline-light" : "outline-dark"}
                  onClick={toggleDarkMode}
                  className="d-flex align-items-center justify-content-center flex-grow-1"
                  style={{ minWidth: "120px" }}
                >
                  {isDarkMode ? <Sun size={16} className="me-1" /> : <Moon size={16} className="me-1" />}
                  {isDarkMode ? "Light" : "Dark"}
                </Button>

                <Button
                  variant={isDarkMode ? "outline-light" : "outline-dark"}
                  onClick={handleShowChangelog}
                  className="d-flex align-items-center justify-content-center flex-grow-1"
                  style={{ minWidth: "120px" }}
                >
                  <History size={16} className="me-1" />
                  Changelog
                </Button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </motion.div>
  );
};

export default Header;
