import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Common/Button';

interface GalleryItem {
  id: string;
  photos: string[];
  date: string;
  city: string;
}

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<GalleryItem[]>([]);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('bunny_lola_sessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-vintage text-bunny-pink">
            📸 Your Photobooth Gallery
          </h1>
          <Button onClick={() => navigate('/')} variant="outline">
            ← Back Home
          </Button>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No photobooth sessions yet!</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Create Your First Photostrip 🐰
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="card-retro cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/print/${session.id}`)}
              >
                <div className="aspect-square bg-gradient-to-br from-retro-pink to-lola-pink rounded-lg overflow-hidden mb-3">
                  {session.photos[0] && (
                    <img src={session.photos[0]} alt="Preview" className="w-full h-full object-cover" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{new Date(session.date).toLocaleDateString()}</p>
                <p className="font-bold text-bunny-pink">{session.city} Vibes ✨</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;