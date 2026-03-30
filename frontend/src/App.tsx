import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from './contexts/SessionContext';
import Home from './pages/Home';
import Studio from './pages/Studio';
import Gallery from './pages/Gallery';
import Print from './pages/Print';

function App() {
  return (
    <SessionProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="min-h-screen bg-gradient-to-b from-retro-pink to-lola-pink">
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#FF69B4',
                color: '#fff',
                fontFamily: 'Comic Neue, cursive',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/studio/solo" element={<Studio />} />
            <Route path="/studio/:roomCode" element={<Studio />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/print/:sessionId" element={<Print />} />
          </Routes>
        </div>
      </Router>
    </SessionProvider>
  );
}

export default App;