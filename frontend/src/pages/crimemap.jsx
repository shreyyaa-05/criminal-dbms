import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.heat';
import { Chart } from 'chart.js/auto';
import axios from 'axios';
import './crimemap.css';   // same folder

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CrimeMap = () => {
  const mapRef = useRef(null);
  const clusterRef = useRef(null);
  const heatLayerRef = useRef(null);
  const evidenceLayerRef = useRef(null);
  const [cases, setCases] = useState([]);
  const [areas, setAreas] = useState([]);
  const [crimes, setCrimes] = useState([]);
  const [filters, setFilters] = useState({
    area: 'all',
    crime: 'all',
    fromDate: '',
    toDate: ''
  });
  const [heatActive, setHeatActive] = useState(false);
  const [evidenceActive, setEvidenceActive] = useState(false);
  const chartRef = useRef(null);

  // Fetch areas & crimes for dropdowns
  useEffect(() => {
    axios.get("http://localhost:8000/allCriminals/hotspots").then(res => setAreas(res.data));
    axios.get("http://localhost:8000/allCriminals/byCrimes")
.then(res => setCrimes(res.data));
  }, []);

  // Fetch cases with current filters
  const fetchCases = async () => {
    const params = {};
    if (filters.area !== 'all') params.area_id = filters.area;
    if (filters.crime !== 'all') params.crime_id = filters.crime;
    if (filters.fromDate) params.from_date = filters.fromDate;
    if (filters.toDate) params.to_date = filters.toDate;
    const res = await axios.get(
'http://localhost:8000/allCriminals/featuredCases'
);
    setCases(res.data);
  };

  useEffect(() => {
    fetchCases();
  }, [filters]);

  // Initialize map (Delhi view)
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('crime-map').setView([28.6139, 77.2090], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> & CartoDB',
        subdomains: 'abcd',
        maxZoom: 18,
      }).addTo(map);
      mapRef.current = map;
      clusterRef.current = L.markerClusterGroup();
      map.addLayer(clusterRef.current);
    }
  }, []);

  // Update markers when cases change
  useEffect(() => {
    if (!clusterRef.current) return;
    clusterRef.current.clearLayers();
    const markers = [];
    cases.forEach(c => {
      if (!c.coordinates) return;
      const [lat, lng] = c.coordinates.split(',').map(Number);
      if (isNaN(lat) || isNaN(lng)) return;
      const popup = `
        <b>Case #${c.case_id}</b><br>
        ${c.case_description || 'No description'}<br>
        📅 ${c.date_committed}<br>
        📍 ${c.location}<br>
        ⚠️ ${c.crime_name}<br>
        📌 Status: ${c.status || 'Active'}
      `;
      const marker = L.marker([lat, lng]).bindPopup(popup);
      markers.push(marker);
    });
    clusterRef.current.addLayers(markers);

    // Update heatmap if active
    if (heatActive) updateHeatmap();
  }, [cases, heatActive]);

  const updateHeatmap=()=>{

if(heatLayerRef.current){
mapRef.current.removeLayer(
heatLayerRef.current
);
}

if(!heatActive) return;

const points=
cases
.filter(c=>c.coordinates)
.map(c=>{
const [lat,lng]=
c.coordinates.split(',')
.map(Number);

return [lat,lng,0.8];
})
.filter(p=>!isNaN(p[0]));

heatLayerRef.current=
L.heatLayer(points,{
radius:25,
blur:15
});

mapRef.current.addLayer(
heatLayerRef.current
);

};

  useEffect(() => { updateHeatmap(); }, [heatActive, cases]);

  const toggleEvidence = async () => {
    if (evidenceLayerRef.current) {
      mapRef.current.removeLayer(evidenceLayerRef.current);
      evidenceLayerRef.current = null;
      setEvidenceActive(false);
    } else {
      const res = await axios.get('http://localhost:8000/allCriminals/evidence');
      const evidence = res.data;
      evidenceLayerRef.current = L.layerGroup();
      evidence.forEach(ev => {
        L.circleMarker([ev.lat, ev.lng], {
          radius: 6,
          color: '#f97316',
          fillColor: '#ef4444',
          fillOpacity: 0.8
        }).bindPopup(`📌 Evidence: ${ev.description}`).addTo(evidenceLayerRef.current);
      });
      mapRef.current.addLayer(evidenceLayerRef.current);
      setEvidenceActive(true);
    }
  };

  // Chart & table update
  useEffect(()=>{

const canvas=document.getElementById('peak-time-chart');
if(!canvas) return;

const ctx=canvas.getContext('2d');

if(chartRef.current){
chartRef.current.destroy();
}

const hourCounts=new Array(24).fill(0);

cases.forEach(c=>{
if(!c.date_committed) return;

const hour=new Date(c.date_committed).getHours();

if(!isNaN(hour)){
hourCounts[hour]++;
}
});

chartRef.current=new Chart(ctx,{
type:'bar',
data:{
labels:Array.from(
{length:24},
(_,i)=>`${i}:00`
),
datasets:[
{
label:'Crimes',
data:hourCounts
}
]
},
options:{
responsive:true,
maintainAspectRatio:true
}
});


const crimeMap=new Map();

cases.forEach(c=>{
const crime=c.crime_name || 'Unknown';
crimeMap.set(
crime,
(crimeMap.get(crime)||0)+1
);
});

const sorted=
Array.from(crimeMap.entries())
.sort((a,b)=>b[1]-a[1]);

const tbody=
document.getElementById(
'crime-table-body'
);

if(tbody){
tbody.innerHTML=
sorted.length
? sorted.map(
([name,count])=>
`<tr>
<td>${name}</td>
<td style="font-weight:600;">
${count}
</td>
</tr>`
).join('')
:
`<tr>
<td colspan="2">
No data
</td>
</tr>`;
}

return ()=>{
if(chartRef.current){
chartRef.current.destroy();
chartRef.current=null;
}
};

},[cases]);

    // Crime breakdown table
    

  return (
    <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '24px', marginTop: '1rem' }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', background: '#1e293b', padding: '1rem', borderRadius: '20px' }}>
        <select value={filters.area} onChange={e => setFilters({...filters, area: e.target.value})}>
          <option value="all">All Areas</option>
          {areas.map((a,index)=>(
<option
key={`${a.area_name}-${index}`}
value={a.area_name}
>
{a.area_name}
</option>
))}
        </select>
        <select value={filters.crime} onChange={e => setFilters({...filters, crime: e.target.value})}>
          <option value="all">All Crimes</option>
          {crimes.map((c,index)=>(
<option
key={`${c.crime_id}-${index}`}
value={c.crime_id}
>
{c.crime_name}
</option>
))}
        </select>
        <input type="date" value={filters.fromDate} onChange={e => setFilters({...filters, fromDate: e.target.value})} placeholder="From" />
        <input type="date" value={filters.toDate} onChange={e => setFilters({...filters, toDate: e.target.value})} placeholder="To" />
        <button className="map-btn primary" onClick={fetchCases}>Apply</button>
        <button className="map-btn secondary" onClick={() => setFilters({ area: 'all', crime: 'all', fromDate: '', toDate: '' })}>Reset</button>
        <button className="map-btn secondary" onClick={() => setHeatActive(!heatActive)}>🔥 Heatmap {heatActive ? 'ON' : 'OFF'}</button>
        <button className="map-btn secondary" onClick={toggleEvidence}>📌 Evidence {evidenceActive ? 'ON' : 'OFF'}</button>
      </div>

      {/* Map + Charts */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '300px', background: '#1e293b', borderRadius: '24px', overflow: 'hidden' }}>
          <div id="crime-map" style={{ height: '450px', width: '100%' }}></div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#1e293b', borderRadius: '20px', padding: '1rem' }}>
            <h3 style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>⏱️ Peak Time (Hourly)</h3>
            <canvas key={cases.length} id="peak-time-chart" height="200" style={{ width: '100%' }}></canvas>
          </div>
          <div style={{ background: '#1e293b', borderRadius: '20px', padding: '1rem' }}>
            <h3 style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>📊 Top Crime Types</h3>
            <table style={{ width: '100%', fontFamily: 'monospace', color: '#cbd5e1', borderCollapse: 'collapse' }}>
              <thead><tr><th>Crime Type</th><th>Count</th></tr></thead>
              <tbody id="crime-table-body"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrimeMap;