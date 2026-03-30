import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createSession, joinSession } from '../utils/api';
import Button from '../components/Common/Button';
import BunnyMascot from '../components/Common/BunnyMascot';
import CitySelector from '../components/CityVibe/CitySelector';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [selectedCity, setSelectedCity] = useState('melbourne');
  const [mode, setMode] = useState<'solo' | 'duo'>('solo');
  const [showJoin, setShowJoin] = useState(false);

  const handleSoloMode = () => {
    // For solo mode, just navigate directly with a special flag
    navigate('/studio/solo', { state: { mode: 'solo', cityVibe: selectedCity } });
  };

  const handleCreateDuoRoom = async () => {
    try {
      const result = await createSession(selectedCity);
      toast.success('✨ Duo photobooth room created! Share the code with your friend');
      navigate(`/studio/${result.roomCode}`, { state: { mode: 'duo', cityVibe: selectedCity } });
    } catch (error) {
      toast.error('Failed to create room');
      console.error(error);
    }
  };

  const handleJoinDuoRoom = async () => {
    if (!roomCode) {
      toast.error('Please enter a room code');
      return;
    }
    try {
      await joinSession(roomCode.toUpperCase());
      toast.success('🎉 Joined the photobooth!');
      navigate(`/studio/${roomCode.toUpperCase()}`, { state: { mode: 'duo' } });
    } catch (error) {
      toast.error('Room not found');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <BunnyMascot size="large" />
          <h1 className="text-5xl font-bold text-bunny-pink mt-4 font-vintage">
            Bunny & Lola
          </h1>
          <p className="text-gray-600 mt-2">Virtual Photobooth with Melbourne Vibes 🐰📸</p>
        </div>

        <div className="card-retro mb-6">
          <CitySelector selectedCity={selectedCity} onCityChange={setSelectedCity} />
        </div>

        {/* Mode Selection Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setMode('solo')}
            className={`p-4 rounded-xl transition-all ${
              mode === 'solo'
                ? 'bg-bunny-pink text-white shadow-lg'
                : 'bg-white hover:bg-lola-pink'
            }`}
          >
            <div className="text-3xl mb-2">🐰</div>
            <div className="font-bold">Solo Mode</div>
            <div className="text-xs mt-1">Just you, one camera</div>
          </button>
          <button
            onClick={() => setMode('duo')}
            className={`p-4 rounded-xl transition-all ${
              mode === 'duo'
                ? 'bg-bunny-pink text-white shadow-lg'
                : 'bg-white hover:bg-lola-pink'
            }`}
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="font-bold">Duo Mode</div>
            <div className="text-xs mt-1">Take photos with a friend</div>
          </button>
        </div>

        {mode === 'solo' ? (
          <Button onClick={handleSoloMode} className="w-full text-lg py-4">
            🎬 Start Solo Photobooth
          </Button>
        ) : (
          <div className="space-y-4">
            {!showJoin ? (
              <div className="space-y-3">
                <Button onClick={handleCreateDuoRoom} className="w-full">
                  ✨ Create Duo Room
                </Button>
                <Button variant="outline" onClick={() => setShowJoin(true)} className="w-full">
                  🔗 Join Existing Room
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter room code (e.g., ABC123)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-full border-2 border-lola-pink focus:border-bunny-pink focus:outline-none text-center text-lg"
                  maxLength={6}
                />
                <Button onClick={handleJoinDuoRoom} className="w-full">
                  🎯 Join Friend's Room
                </Button>
                <Button variant="outline" onClick={() => setShowJoin(false)} className="w-full">
                  ← Back
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Home;