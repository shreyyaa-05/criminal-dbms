import React from 'react';

const CriminalCard = ({ data }) => {
  // data object from backend should contain:
  // criminal_id, name (full), gender, crimeType, location, date_committed,
  // caseStatus, prisonName, case_description

  return (
    <div className="card">
      <p className="card-title">
        {data.name || 'Unknown'}
        {data.gender && <span className="gender-badge"> ({data.gender})</span>}
      </p>
      <p className="small-desc">
        <strong>Crime:</strong> {data.crimeType || 'Not specified'}<br />
        <strong>Location:</strong> {data.location || 'Unknown'}<br />
        <strong>Date committed:</strong> {data.date_committed || 'N/A'}<br />
        <strong>Case Status:</strong> {data.caseStatus || 'Active'}<br />
        {data.prisonName && <><strong>Prison:</strong> {data.prisonName}<br /></>}
        <strong>Case description:</strong> {data.case_description?.substring(0, 80)}...
        <br />
        <small className="case-id">Criminal ID: {data.criminal_id}</small>
      </p>
      <div className="go-corner">
        <div className="go-arrow">→</div>
      </div>
      {/* === ADD IMAGE HERE: uncomment and replace with actual field === */}
      {/* {data.photo_url && <img src={data.photo_url} alt="Mugshot" className="card-image" />} */}
    </div>
  );
};

export default CriminalCard;