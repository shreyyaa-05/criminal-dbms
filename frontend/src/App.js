// App.js - updated version
import logo from './logo.svg';
import './App.css';
import Home from '../src/pages/home';
import Crimemap from '../src/pages/crimemap';
import Search from '../src/pages/Search';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Complaint from './pages/complaint';
import NewsPage from './pages/news';
import ComplaintState from './context/complaint/ComplaintState';
import AuthForm from './components/login/register/login';
import ComplaintList from './pages/ComplaintList';
import Navbar from './components/navbar/navbar';  // ✅ ADD THIS IMPORT

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

function App() {
  return (
    <ComplaintState>
      <Router>   
        {}
        <Navbar />
        
        {}
        <div className="app-content">
          <Routes>
            <Route exact path='/' element={<Home/>} />
            <Route path='/hotspots' element={<Home/>} />
            <Route exact path='/search' element={<Search/>} />
            <Route exact path='/crimemap' element={<Crimemap/>} />
            <Route exact path='/complaint' element={<Complaint/>} />
            <Route exact path='/news' element={<NewsPage/>} />
            <Route exact path='/login' element={<AuthForm/>} />
            <Route exact path='/admin' element={<ComplaintList/>} />
          </Routes>
        </div>
      </Router> 
    </ComplaintState>
  );
}

export default App;