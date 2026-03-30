import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../Common/Button';
import { joinSession } from '../../utils/api';

const JoinRoom: React.FC = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }
    
    setIsJoining(true);
    try {
      await joinSession(roomCode.toUpperCase());
      toast.success('🎉 Joined the photobooth!');
      navigate(`/studio/${roomCode.toUpperCase()}`);
    } catch (error) {
      toast.error('Room not found');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-retro"
    >
      <h2 className="text-2xl font-bold text-bunny-pink mb-4">Join Existing Room 🔗</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter room code (e.g., ABC123)"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          className="w-full px-4 py-3 rounded-full border-2 border-lola-pink focus:border-bunny-pink focus:outline-none text-center text-lg"
          maxLength={6}
        />
        <Button onClick={handleJoin} disabled={isJoining} className="w-full">
          {isJoining ? 'Joining...' : '🎯 Join Photobooth'}
        </Button>
      </div>
    </motion.div>
  );
};

export default JoinRoom;