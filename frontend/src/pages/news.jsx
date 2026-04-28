import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import "./news.css";

function NewsPage() {

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/news");
      if (!res.ok) {
        throw new Error("Server unavailable");
      }
      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error(error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    /* live refresh every 60 sec */
    const interval = setInterval(loadNews, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="newsContainer">
      <Navbar />

      <div className="news-page">
        {/* Header with Most Wanted link in top corner */}
        <div className="news-header-wrapper">
          <div className="news-header-content">
            <div className="news-title-section">
              <h2>Live Crime Intelligence Feed</h2>
              <p className="news-subtitle">
                Real-Time Delhi Crime Monitoring & Incident Bulletin
              </p>
            </div>
            <div className="most-wanted-link">
              <Link to="/mostwanted" className="wanted-badge-link">
                <span className="wanted-icon">⚠️</span>
                MOST WANTED
                <span className="arrow-icon">→</span>
              </Link>
            </div>
          </div>
        </div>

        {loading && (
          <div className="loading">
            Loading intelligence feed...
          </div>
        )}

        {!loading && news.length === 0 && (
          <div className="no-results">
            No live articles available.
          </div>
        )}

        <div className="news-grid">
          {news.map(article => (
            <div key={article.id} className="news-card">
              <div className="threat-chip">
                LIVE
              </div>
              <h3 className="news-title">
                {article.title}
              </h3>
              <p className="news-source">
                Source: {article.source}
              </p>
              <p className="news-description">
                {article.description}
              </p>
              <div className="news-meta">
                <span>
                  {new Date(article.published_at).toLocaleString()}
                </span>
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="read-btn"
              >
                View Report →
              </a>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default NewsPage;