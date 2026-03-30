import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../Common/Button';
import { createSession } from '../../utils/api';

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [cityVibe, setCityVibe] = useState('melbourne');

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const result = await createSession(cityVibe);
      toast.success('✨ Photobooth room created!');
      navigate(`/studio/${result.roomCode}`);
    } catch (error) {
      toast.error('Failed to create room');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-retro"
    >
      <h2 className="text-2xl font-bold text-bunny-pink mb-4">Create New Photobooth 🐰</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Choose your vibe:</label>
          <select
            value={cityVibe}
            onChange={(e) => setCityVibe(e.target.value)}
            className="w-full p-2 border-2 border-lola-pink rounded-lg"
          >
            <option value="melbourne">Melbourne - Laneway vibes 🎨</option>
            <option value="sydney">Sydney - Beach vibes 🏖️</option>
            <option value="brisbane">Brisbane - Tropical 🌴</option>
            <option value="perth">Perth - Sunset vibes 🌅</option>
            <option value="tokyo">Tokyo - Cherry blossoms 🌸</option>
            <option value="paris">Paris - Romantic 🥐</option>
          </select>
        </div>
        <Button onClick={handleCreate} disabled={isCreating} className="w-full">
          {isCreating ? 'Creating...' : '✨ Create Room'}
        </Button>
      </div>
    </motion.div>
  );
};

export default CreateRoom;