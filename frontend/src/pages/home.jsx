import React,{useEffect,useState} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './home.css';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer/footer';

// Import your image (adjust path as needed)
import heroImage from './home.jpg'; // replace with your actual image

export default function Home() {
  const navigate = useNavigate();
  const [featuredCases,setFeaturedCases]=useState([]);

useEffect(()=>{
 const loadCases=async()=>{
 const res=await axios.get(
 "http://localhost:8000/allCriminals/featuredCases"
 );
 setFeaturedCases(res.data);
 };
 loadCases();
},[]);

  // Original navigation actions – unchanged
  const handleSearch = () => navigate('/search');
  const handleComplaint = () => navigate('/complaint');

  return (
    <div className='home'>
      {/* Original Navbar – all auth links work exactly as before */}
      <Navbar />

      {/* Hero section with image on the right */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge-area">
              <span className="hero-badge">CRIME INTELLIGENCE PORTAL</span>
            </div>
            <h1 className="hero-title">
              LANDING PAGE <br />
              <span className="hero-title-accent">TEMPLATE</span>
            </h1>
            <p className="hero-description">
              Advanced crime analytics, real-time case tracking, and digital investigation tools.
              Empowering law enforcement with next-gen technology.
            </p>
            <div className="hero-buttons-group">
              <button className="btn-primary" onClick={handleSearch}>
                Search Records →
              </button>
              <button className="btn-outline" onClick={handleComplaint}>
                Register Complaint
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">2,847+</span>
                <span className="stat-label">Cases Solved</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">156</span>
                <span className="stat-label">Active Investigations</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.8%</span>
                <span className="stat-label">Response Rate</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Crime investigation" />
          </div>
        </div>
      </section>

      {/* CRIME & INVESTIGATION cards – visual only */}
      <section className="dual-section">
        <div className="dual-container">
          <div className="crime-card">
            <div className="card-icon">⚖️</div>
            <h2 className="card-title">CRIME</h2>
            <p className="card-description">
              Comprehensive database of criminal records, forensic evidence, and historical case data.
              Access real-time crime mapping and pattern analysis.
            </p>
            <ul className="card-features">
              <li>Real-time crime mapping</li>
              <li>Criminal profiling</li>
              <li>Evidence tracking</li>
            </ul>
            <button className="card-btn" onClick={handleSearch}>
              EXPLORE CRIME DATA →
            </button>
          </div>
          <div className="investigation-card">
            <div className="card-icon">🕵️</div>
            <h2 className="card-title">INVESTIGATION</h2>
            <p className="card-description">
              Advanced investigation suite with case management, digital forensics, and collaborative tools.
              Streamline your investigative workflow.
            </p>
            <ul className="card-features">
              <li>Case management system</li>
              <li>Digital forensics tools</li>
              <li>Team collaboration hub</li>
            </ul>
            <button className="card-btn" onClick={handleComplaint}>
              START INVESTIGATION →
            </button>
          </div>
        </div>
      </section>

      {/* Featured cases section – visual only */}
      <section className="cases-preview">
        <div className="cases-header">
          <span className="cases-badge">ACTIVE CASES</span>
          <h2 className="cases-title">High‑Priority Investigations</h2>
        </div>
        <div className="cases-grid">
          {featuredCases.map((item,index)=>(
<div className="case-card" key={index}>

<div className={`case-status ${
index===0?"critical":
index===1?"high":"medium"
}`}>
{item.status}
</div>

<h3>{item.location}</h3>

<p>{item.case_description}</p>

<div className="case-meta">
{item.date_committed}
</div>

</div>
))}
        </div>
        <div className="cases-footer">
          <button className="view-all-btn" onClick={handleSearch}>
            VIEW ALL CASES →
          </button>
        </div>
      </section>

     
      <Footer />
    </div>
  );
}