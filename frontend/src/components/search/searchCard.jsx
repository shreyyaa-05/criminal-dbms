import React from 'react';
import './searchcard.css'; // We'll move the styles to a separate CSS file

const CriminalCard = ({ data }) => {
  return (
    <div className="cyber-container noselect">
      {/* Interactive 3D grid trackers */}
      <div className="cyber-canvas">
        <div className="tracker tr-1"></div>
        <div className="tracker tr-2"></div>
        <div className="tracker tr-3"></div>
        <div className="tracker tr-4"></div>
        <div className="tracker tr-5"></div>
        <div className="tracker tr-6"></div>
        <div className="tracker tr-7"></div>
        <div className="tracker tr-8"></div>
        <div className="tracker tr-9"></div>
        <div className="tracker tr-10"></div>
        <div className="tracker tr-11"></div>
        <div className="tracker tr-12"></div>
        <div className="tracker tr-13"></div>
        <div className="tracker tr-14"></div>
        <div className="tracker tr-15"></div>
        <div className="tracker tr-16"></div>
        <div className="tracker tr-17"></div>
        <div className="tracker tr-18"></div>
        <div className="tracker tr-19"></div>
        <div className="tracker tr-20"></div>
        <div className="tracker tr-21"></div>
        <div className="tracker tr-22"></div>
        <div className="tracker tr-23"></div>
        <div className="tracker tr-24"></div>
        <div className="tracker tr-25"></div>
      </div>

      {/* Main Card with Cyber Effects */}
      <div id="cyber-card">
        <div className="card-content">
          {/* Visual effects layers */}
          <div className="card-glare"></div>
          <div className="cyber-lines">
            <span></span><span></span><span></span><span></span>
          </div>
          <div className="glowing-elements">
            <div className="glow-1"></div>
            <div className="glow-2"></div>
            <div className="glow-3"></div>
          </div>
          <div className="card-particles">
            <span></span><span></span><span></span>
            <span></span><span></span><span></span>
          </div>
          <div className="corner-elements">
            <span></span><span></span><span></span><span></span>
          </div>
          <div className="scan-line"></div>

          {/* ACTUAL CRIMINAL DATA - keeping all text backend exactly same */}
          <div className="status-chip-wrapper">
            <span className={`status-chip ${data.status?.toLowerCase()}`}>
              {data.status}
            </span>
          </div>

          <div className="cyber-title">
            {data.first_name} {data.last_name}
            <span className="gender-badge"> ({data.gender})</span>
          </div>

          <div className="criminal-details">
            <p><strong className="neon-label">Crime:</strong> {data.crime_name}</p>
            <p><strong className="neon-label">Location:</strong> {data.location}</p>
            <p><strong className="neon-label">Case Status:</strong> {data.status}</p>
            <p><strong className="neon-label">Prison:</strong> {data.prison_name || "Under Investigation"}</p>
            <p><strong className="neon-label">Case description:</strong> {data.case_description}</p>
            <p className="criminal-id">
              <strong className="neon-label">Criminal ID:</strong> 
              <span className="id-highlight"> {data.criminal_id}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriminalCard;