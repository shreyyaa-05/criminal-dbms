import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer/footer';
import CriminalCard from '../components/search/searchCard';
import './search.css';

const SearchPage = () => {
  // Filters reflect your database columns
  const [filters, setFilters] = useState({
    name: '',           // searches first_name + last_name
    gender: '',
    crimeType: '',      // crime_name
    prison: '',         // prison_name
    location: '',       // cases.location
    caseStatus: '',     // cases.status
  });

  const [sortBy, setSortBy] = useState('name');   // name, date_committed, location
  const [sortOrder, setSortOrder] = useState('asc');
  const [criminalData, setCriminalData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllCriminals();
  }, []);

  // Fetch all criminals with joined data from backend
  const loadAllCriminals = async () => {
    setLoading(true);
    try {
      // Expecting backend endpoint that returns an array of objects like:
      // { criminal_id, name, gender, crimeType, location, date_committed, caseStatus, prisonName, case_description }
      const result = await axios.get('http://localhost:8000/api/criminals');
      const sorted = sortResults(result.data, sortBy, sortOrder);
      setCriminalData(sorted);
    } catch (error) {
      console.error('Error loading criminals:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortResults = (data, field, order) => {
    const sorted = [...data];
    sorted.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'date_committed') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    const sorted = sortResults(criminalData, newSortBy, sortOrder);
    setCriminalData(sorted);
  };

  const handleSortOrderChange = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    const sorted = sortResults(criminalData, sortBy, newOrder);
    setCriminalData(sorted);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend should accept filters and return filtered & sorted results
      const result = await axios.post('http://localhost:8000/api/criminals/search', {
        ...filters,
        sortBy,
        sortOrder,
      });
      setCriminalData(result.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      gender: '',
      crimeType: '',
      prison: '',
      location: '',
      caseStatus: '',
    });
    loadAllCriminals();
  };

  return (
    <div className="searchContainer">
      <Navbar />
      <div className="search-page">
        <h2>Investigation Dashboard</h2>

        <form onSubmit={handleSearch}>
          <div className="filter-container">
            {/* Column 1 */}
            <div className="filter-column">
              <div className="filter-section">
                <label htmlFor="name">Criminal Name:</label>
                <input
                  type="text"
                  id="name"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  placeholder="First or last name"
                />
              </div>
              <div className="filter-section">
                <label htmlFor="gender">Gender:</label>
                <select
                  id="gender"
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Column 2 */}
            <div className="filter-column">
              <div className="filter-section">
                <label htmlFor="crimeType">Crime Type:</label>
                <input
                  type="text"
                  id="crimeType"
                  value={filters.crimeType}
                  onChange={(e) => handleFilterChange('crimeType', e.target.value)}
                  placeholder="e.g., Robbery, Murder"
                />
              </div>
              <div className="filter-section">
                <label htmlFor="prison">Prison Name:</label>
                <input
                  type="text"
                  id="prison"
                  value={filters.prison}
                  onChange={(e) => handleFilterChange('prison', e.target.value)}
                  placeholder="Prison facility"
                />
              </div>
            </div>

            {/* Column 3 */}
            <div className="filter-column">
              <div className="filter-section">
                <label htmlFor="location">Location (City/Area):</label>
                <input
                  type="text"
                  id="location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="Crime location"
                />
              </div>
              <div className="filter-section">
                <label htmlFor="caseStatus">Case Status:</label>
                <select
                  id="caseStatus"
                  value={filters.caseStatus}
                  onChange={(e) => handleFilterChange('caseStatus', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Under Investigation">Under Investigation</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sorting row */}
          <div className="sorting-row">
            <div className="filter-section">
              <label htmlFor="sortBy">Sort by:</label>
              <select id="sortBy" value={sortBy} onChange={handleSortChange}>
                <option value="name">Name</option>
                <option value="date_committed">Date Committed</option>
                <option value="location">Location</option>
              </select>
            </div>
            <div className="filter-section">
              <label>Order:</label>
              <button type="button" onClick={handleSortOrderChange} className="sort-order-btn">
                {sortOrder === 'asc' ? 'Ascending ▲' : 'Descending ▼'}
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button type="submit" className="search-btn">🔍 Search</button>
            <button type="button" onClick={resetFilters} className="reset-btn">⟳ Reset</button>
          </div>
        </form>
      </div>

      <div className="criminals-list">
        {loading ? (
          <div className="loading">Loading criminals...</div>
        ) : criminalData.length === 0 ? (
          <div className="no-results">No criminals found. Adjust filters.</div>
        ) : (
          criminalData.map((criminal) => (
            <CriminalCard key={criminal.criminal_id} data={criminal} />
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;