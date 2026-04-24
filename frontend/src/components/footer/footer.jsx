import React from 'react';
import { useNavigate } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const navigate = useNavigate();

  const handleSearch = () => navigate('/search');

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>Helpline Numbers</h3>
          <div className="footer-contact-item">
            <span className="footer-icon">📞</span>
            <a href="tel:+917976295779" className="footer-link">+91 7976295779</a>
          </div>
          <div className="footer-contact-item">
            <span className="footer-icon">📞</span>
            <a href="tel:+916265626254" className="footer-link">+91 6265626254</a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Email</h3>
          <div className="footer-contact-item">
            <span className="footer-icon">✉️</span>
            <a href="mailto:support@criminaldbms.in" className="footer-link">support@criminaldbms.in</a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <button onClick={handleSearch} className="footer-search-btn">
            🔍 Search Records
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Crime Intelligence Portal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;