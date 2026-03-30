import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../Common/Button';

interface PrintButtonProps {
  photos: string[];
  design: any;
  cityVibe: any;
}

const PrintButton: React.FC<PrintButtonProps> = ({ photos, design, cityVibe }) => {
  const navigate = useNavigate();
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    
    // Save session to localStorage
    const sessionId = Date.now().toString();
    const sessionData = {
      id: sessionId,
      photos,
      design,
      cityVibe,
      captions: design.captions || [],
      date: new Date().toISOString()
    };
    
    const existingSessions = JSON.parse(localStorage.getItem('bunny_lola_sessions') || '[]');
    existingSessions.push(sessionData);
    localStorage.setItem('bunny_lola_sessions', JSON.stringify(existingSessions));
    localStorage.setItem(`session_${sessionId}`, JSON.stringify(sessionData));
    
    toast.success('✨ Photostrip saved to gallery!');
    setTimeout(() => {
      navigate(`/print/${sessionId}`);
    }, 1000);
  };

  return (
    <Button
      onClick={handlePrint}
      disabled={isPrinting || photos.length === 0}
      className="w-full"
    >
      {isPrinting ? '🖨️ Preparing...' : '🖨️ Print & Save'}
    </Button>
  );
};

export default PrintButton;