import React, { useEffect, useState } from 'react';
import './home.css';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer/footer';
import Upcoming from '../components/upcoming/upcoming_event'


export default function Home() {

 return (
  <div className='home'>
    <Navbar />

    <div className="contone">

      <div className="hero-content">

        <p className="hero-badge">
          Crime Intelligence Portal
        </p>

        <h1>
          Search Criminal Records <br/>
          Track Cases. Report Crime.
        </h1>

        <p className="hero-subtext">
          Access criminal records, register complaints and monitor
          investigations through a centralized portal.
        </p>

        <div className="hero-buttons">
          <button>Search Records</button>
          <button className="secondary">
             Register Complaint
          </button>
        </div>

      </div>

    </div>

    <Footer />
  </div>
 )
}