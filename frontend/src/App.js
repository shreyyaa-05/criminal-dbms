import logo from './logo.svg';
import './App.css';
import Home from '../src/pages/home'
import Crimemap from '../src/pages/crimemap'
import Search from '../src/pages/Search'
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom'; 
import Complaint from './pages/complaint'
import NewsPage from './pages/news';
import ComplaintState from './context/complaint/ComplaintState';
import AuthForm from './components/login/register/login';
import ComplaintList from './pages/ComplaintList';
import CrimeMap from './pages/crimemap';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

function App() {
  return (
    <ComplaintState>
    <Router>   
        <Routes>
<Route exact path='/' element={<Home/>}></Route>

<Route path='/hotspots' element={<Home/>}></Route>

<Route exact path='/search' element={<Search/>}></Route>

<Route exact path='/crimemap' element={<Crimemap/>}></Route>

<Route exact path='/complaint' element={<Complaint/>}></Route>

<Route exact path='/news' element={<NewsPage/>}></Route>

<Route exact path='/login' element={<AuthForm/>}></Route>

<Route exact path='/admin' element={<ComplaintList/>}></Route>

</Routes>
    </Router> 
    </ComplaintState>
  );
}

export default App;
