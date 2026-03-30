import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import CountdownTimer from './CountdownTimer';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface SplitScreenCameraProps {
  onCapture: (imageData: string) => void;
  isCapturing: boolean;
  setIsCapturing: (value: boolean) => void;
  currentPhotoIndex: number;
  friendConnected?: boolean;
  friendPhoto?: string | null;
}

const SplitScreenCamera: React.FC<SplitScreenCameraProps> = ({
  onCapture,
  isCapturing,
  setIsCapturing,
  currentPhotoIndex,
  friendConnected = false,
  friendPhoto = null
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (countdown === 0) {
      capture();
      setCountdown(null);
      setIsCapturing(false);
    }
  }, [countdown]);

  const startCapture = () => {
    setCountdown(3);
    setIsCapturing(true);
    toast(`Get ready! Photo ${currentPhotoIndex + 1} in 3...`, { icon: '🐰' });
  };

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setLastPhoto(imageSrc);
        setShowPreview(true);
        setTimeout(() => {
          onCapture(imageSrc);
          setShowPreview(false);
          const audio = new Audio('/sounds/shutter.mp3');
          audio.play().catch(e => console.log('Audio play failed'));
        }, 500);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Your Camera */}
        <div className="relative">
          <div className="camera-frame relative">
            {showPreview && lastPhoto ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 z-10 bg-black rounded-lg flex items-center justify-center"
              >
                <img src={lastPhoto} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                  <div className="text-4xl animate-bounce">📸</div>
                </div>
              </motion.div>
            ) : null}
            
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 320,
                height: 240,
                facingMode: "user"
              }}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              🐰 You
            </div>
          </div>
        </div>

        {/* Friend's Camera or Waiting Screen */}
        <div className="relative">
          <div className="camera-frame bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center min-h-[256px] rounded-lg">
            {friendConnected && friendPhoto ? (
              <img 
                src={friendPhoto} 
                alt="Friend" 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : friendConnected ? (
              <div className="text-center">
                <div className="text-6xl mb-2 animate-bounce">🐰</div>
                <p className="text-bunny-pink font-bold">Friend connected!</p>
                <p className="text-sm text-gray-600">Waiting for their photos...</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-2">📱</div>
                <p className="text-bunny-pink font-bold">Share this room code:</p>
                <p className="text-2xl font-mono font-bold bg-white px-4 py-2 rounded-lg mt-2">
                  {window.location.pathname.split('/').pop()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Friend will appear here when they join!
                </p>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {friendConnected ? '👋 Friend' : '🌟 Waiting for Friend'}
            </div>
          </div>
        </div>
      </div>

      {countdown !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <CountdownTimer count={countdown} onComplete={() => {}} />
        </div>
      )}

      {!isCapturing && countdown === null && (
        <button
          onClick={startCapture}
          className="w-full btn-pink text-xl py-4"
        >
          📸 Take Photo {currentPhotoIndex + 1}
        </button>
      )}

      {isCapturing && countdown === null && (
        <div className="text-center text-bunny-pink font-bold animate-pulse">
          Ready to capture! Click the button above
        </div>
      )}
    </div>
  );
};

export default SplitScreenCamera;