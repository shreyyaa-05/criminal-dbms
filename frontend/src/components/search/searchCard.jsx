import React from 'react';

const CriminalCard = ({ data }) => {

return (
<div className="card">
<span className={`status-chip ${data.status?.toLowerCase()}`}>
{data.status}
</span>
<p className="card-title">
{data.first_name} {data.last_name}
<span className="gender-badge">
 ({data.gender})
</span>
</p>

<p className="small-desc">

<strong>Crime:</strong>
{data.crime_name}
<br/>

<strong>Location:</strong>
{data.location}
<br/>

<strong>Case Status:</strong>
{data.status}
<br/>

<strong>Prison:</strong>
{data.prison_name || "Under Investigation"}
<br/>

<strong>Case description:</strong>
{data.case_description}
<br/>

<small className="case-id">
Criminal ID:
{data.criminal_id}
</small>

</p>

<div className="go-corner">
<div className="go-arrow">
→
</div>
</div>

</div>
);
};

export default CriminalCard;