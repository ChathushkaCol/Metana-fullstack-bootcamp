import Layout from "./Layout.jsx";

import Home from "./Home";

import Timer from "./Timer";

import Library from "./Library";

import AICoach from "./AICoach";

import MeditationPlayer from "./MeditationPlayer";

import Stats from "./Stats";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Timer: Timer,
    
    Library: Library,
    
    AICoach: AICoach,
    
    MeditationPlayer: MeditationPlayer,
    
    Stats: Stats,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Timer" element={<Timer />} />
                
                <Route path="/Library" element={<Library />} />
                
                <Route path="/AICoach" element={<AICoach />} />
                
                <Route path="/MeditationPlayer" element={<MeditationPlayer />} />
                
                <Route path="/Stats" element={<Stats />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}