import React, { useState, useEffect } from 'react';
import './MostWanted.css'; // We'll create this separately

const MostWanted = () => {
    const [criminalsList, setCriminalsList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState('🔍 most wanted database active');

    // Fallback demo data
    const FALLBACK_MOST_WANTED = [
        {
            id: 1,
            name: "LARS PEETERS",
            reward: 1234.56,
            description: "Last seen near the northern ridge trails, Lars Peeters is considered resourceful and evasive. Standing at 6'2\" with hazel eyes, he was last seen wearing a dark green winter parka, black snow pants, heavy-duty boots, and a gray wool beanie.",
            contact: "123-456-7890",
            imageUrl: null,
            extra_link: "https://www.interpol.int/en/News-and-Events"
        },
        {
            id: 2,
            name: "ELENA VANCE",
            reward: 8750.00,
            description: "Wanted for cyber crime syndicate and identity theft. Known to operate near metropolitan areas. Last seen with a laptop bag, glasses, and reddish hair. Approach with caution.",
            contact: "123-456-7890",
            imageUrl: null,
            extra_link: "#"
        },
        {
            id: 3,
            name: "MARCUS 'GHOST' DEVEREAUX",
            reward: 50000.00,
            description: "Leader of the eastern trafficking ring. Tattoos on neck, muscular build. Last reported in border regions. Armed and extremely dangerous. If seen, notify immediately.",
            contact: "911",
            imageUrl: null,
            extra_link: "#"
        }
    ];

    // Render photo area
    const renderPhotoArea = (criminal) => {
        const imageUrl = criminal?.imageUrl || null;
        
        if (imageUrl && imageUrl.trim() !== "") {
            return (
                <img 
                    src={imageUrl} 
                    alt={criminal.name} 
                    className="suspect-img"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                            <div class="img-placeholder">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="70" height="70">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#C28B55"/>
                                </svg>
                                <span style="font-size:1.4rem;font-weight:bold;">NO RECENT IMAGE</span>
                                <span style="font-size:0.9rem;">${criminal.name}</span>
                            </div>
                        `;
                    }}
                />
            );
        } else {
            return (
                <div className="img-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="70" height="70">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#C28B55"/>
                    </svg>
                    <span style={{fontSize: '1.4rem', fontWeight: 'bold'}}>NO RECENT IMAGE</span>
                    <span style={{fontSize: '0.9rem'}}>{criminal?.name || 'Unknown'}</span>
                </div>
            );
        }
    };

    // Fetch criminals from backend
    const fetchMostWantedList = async () => {
        setIsLoading(true);
        setStatusMsg("⏳ fetching from CriminalDB backend...");
        
        try {
            let response;
            try {
                response = await fetch('/mostwanted');
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
            } catch(e) {
                console.warn("First attempt failed, try /api/mostwanted", e);
                response = await fetch('/api/mostwanted');
                if (!response.ok) throw new Error(`API error ${response.status}`);
            }
            
            const data = await response.json();
            let criminalsArray = Array.isArray(data) ? data : (data.criminals || data.data || []);
            
            if (criminalsArray.length === 0) throw new Error("empty list");
            
            const mappedList = criminalsArray.map(c => ({
                id: c.id || c._id,
                name: c.name || c.fullname || "Unnamed suspect",
                reward: c.reward || c.bounty || 0,
                description: c.description || "No description provided by agency.",
                contact: c.contact_phone || c.contact || "123-456-7890",
                imageUrl: c.imageUrl || c.photo_url || null,
                extra_link: c.link || c.report_link || "https://www.warner-spencer.fbi/criminals"
            }));
            
            setCriminalsList(mappedList);
            setCurrentIndex(0);
            setStatusMsg(`🕵️‍♂️ DATABASE ACTIVE • ${mappedList.length} suspects loaded`);
        } catch (err) {
            console.error("Backend fetch error:", err);
            setStatusMsg("⚠️ using emergency dataset (backend unreachable)");
            setCriminalsList(FALLBACK_MOST_WANTED);
            setCurrentIndex(0);
        } finally {
            setIsLoading(false);
        }
    };

    // Navigation handlers
    const goPrev = () => {
        if (isLoading) return;
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const goNext = () => {
        if (isLoading) return;
        if (currentIndex < criminalsList.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchMostWantedList();
    }, []);

    const currentCriminal = criminalsList[currentIndex];
    const formattedReward = currentCriminal ? 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(currentCriminal.reward || 0) 
        : '$---.--';

    return (
        <div className="wanted-container">
            <div className="wanted-inner">
                <div className="agency-header">WARNER &amp; SPENCER</div>
                <div className="wanted-badge"><span>WANTED</span></div>

                <div className="wanted-content">
                    <div className="photo-area">
                        <div className="photo-frame">
                            {currentCriminal ? renderPhotoArea(currentCriminal) : (
                                <div className="img-placeholder skeleton-img">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#C59B6C"/>
                                    </svg>
                                    <span>loading profile...</span>
                                </div>
                            )}
                        </div>
                        <div className="reward-strip">
                            💰 <span>{formattedReward}</span> REWARD
                        </div>
                    </div>
                    
                    <div className="description-area">
                        <div className="wanted-name">
                            {currentCriminal?.name?.toUpperCase() || '—— ——'}
                        </div>
                        <div className="desc-text">
                            {currentCriminal?.description || 'Fetching most wanted data from CriminalDB backend...'}
                        </div>
                        <div className="call-box">
                            <span>📞 PLEASE CALL</span>
                            <span className="call-number">
                                {currentCriminal?.contact || '123-456-7890'}
                            </span>
                            <a 
                                href={currentCriminal?.extra_link || "#"} 
                                className="visit-link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Visit official portal →
                            </a>
                        </div>
                    </div>
                </div>

                <div className="action-bar">
                    <div className="nav-buttons">
                        <button 
                            className="wanted-btn" 
                            onClick={goPrev}
                            disabled={currentIndex === 0 || isLoading}
                            style={{ opacity: currentIndex === 0 || isLoading ? '0.5' : '1' }}
                        >
                            ◀ PREVIOUS
                        </button>
                        <button 
                            className="wanted-btn" 
                            onClick={goNext}
                            disabled={criminalsList.length === 0 || currentIndex === criminalsList.length - 1 || isLoading}
                            style={{ opacity: criminalsList.length === 0 || currentIndex === criminalsList.length - 1 || isLoading ? '0.5' : '1' }}
                        >
                            NEXT ▶
                        </button>
                    </div>
                    <div className="load-status">{statusMsg}</div>
                </div>
            </div>
        </div>
    );
};

export default MostWanted;