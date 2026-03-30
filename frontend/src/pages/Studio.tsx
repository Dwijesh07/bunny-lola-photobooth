import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Webcam from 'react-webcam';
import PhotoStrip from '../components/Design/PhotoStrip';
import StickerPicker from '../components/Design/StickerPicker';
import CityTheme from '../components/CityVibe/CityTheme';
import PrintButton from '../components/Print/PrintButton';
import { useSession } from '../contexts/SessionContext';
import { createSession, uploadPhoto } from '../utils/api';

const Studio: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { setSession, design, setDesign, cityVibe, setCityVibe } = useSession();
  
  const webcamRef = useRef<Webcam>(null);
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureCount, setCaptureCount] = useState(3);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showStrip, setShowStrip] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const mode = location.state?.mode || (roomCode === 'solo' ? 'solo' : 'duo');
  const isSolo = mode === 'solo';
  const cityVibeName = cityVibe?.name || location.state?.cityVibe || 'melbourne';

  // Story caption examples
  const storyExamples = [
    "The moment we met ✨",
    "Laughter fills the air 💕",
    "A memory frozen in time 📸",
    "Together, always 🐰",
    "Melbourne magic 🎨",
    "Just us, forever 💫",
    "This is our story 📖",
    "Happiness is this 🌸"
  ];

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      if (isSolo && !sessionId) {
        const result = await createSession(cityVibeName);
        setSessionId(result.session.id);
        setSession(result.session);
      }
    };
    initSession();
  }, [isSolo]);

  // Countdown timer - FIXED
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    if (countdown === 0) {
      capturePhoto();
      setCountdown(null);
      setIsCapturing(false);
    }
  }, [countdown]);

  const startCapture = () => {
    if (currentPhotoIndex >= captureCount) {
      setShowStrip(true);
      return;
    }
    setCountdown(3);
    setIsCapturing(true);
    toast(`Get ready! Photo ${currentPhotoIndex + 1} in 3...`, { icon: '🐰' });
  };

  const capturePhoto = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        
        
        // Save photo
        const newPhotos = [...photos];
        newPhotos[currentPhotoIndex] = imageSrc;
        setPhotos(newPhotos);
        
        const nextIndex = currentPhotoIndex + 1;
        
        if (nextIndex < captureCount) {
          setCurrentPhotoIndex(nextIndex);
          toast.success(`Photo ${currentPhotoIndex + 1} captured! ${captureCount - nextIndex} more to go!`);
          // Start next photo after 1.5 seconds
          setTimeout(() => {
            startCapture();
          }, 1500);
        } else {
          toast.success('🎉 All photos captured! Time to tell your story!');
          setShowStrip(true);
        }
      }
    }
  };

  // Solo mode camera view
  if (isSolo && !showStrip) {
    return (
      <div className="min-h-screen p-4">
        <CityTheme city={cityVibeName} />
        
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-vintage text-bunny-pink">
              🐰 Bunny & Lola Photobooth
            </h1>
            <button
              onClick={() => navigate('/')}
              className="text-bunny-pink hover:text-pink-600"
            >
              ← Exit
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-retro">
              <h2 className="text-2xl font-bold text-bunny-pink mb-4">
                {currentPhotoIndex + 1} of {captureCount} Photos
              </h2>
              
              <div className="relative">
                <div className="camera-frame bg-black rounded-lg overflow-hidden">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 640,
                      height: 480,
                      facingMode: "user"
                    }}
                    className="w-full rounded-lg"
                  />
                </div>
                
                {countdown !== null && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg z-10">
                    <div className="text-8xl font-bold text-white bg-bunny-pink rounded-full w-32 h-32 flex items-center justify-center">
                      {countdown}
                    </div>
                  </div>
                )}
              </div>

              {!isCapturing && countdown === null && (
                <button
                  onClick={startCapture}
                  className="w-full btn-pink text-xl py-4 mt-4"
                >
                  📸 Take Photo {currentPhotoIndex + 1}
                </button>
              )}
              
              {isCapturing && countdown === null && (
                <div className="w-full text-center py-4 mt-4 text-bunny-pink font-bold animate-pulse">
                  ✨ Getting ready for next photo...
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="card-retro">
                <h3 className="text-xl font-bold text-bunny-pink mb-3">
                  Settings
                </h3>
                <label className="block">
                  Number of photos:
                  <select
                    value={captureCount}
                    onChange={(e) => {
                      setCaptureCount(Number(e.target.value));
                      setPhotos([]);
                      setCurrentPhotoIndex(0);
                      setShowStrip(false);
                      setDesign({ ...design, captions: [] });
                    }}
                    className="ml-2 p-1 rounded border border-lola-pink"
                  >
                    <option value={3}>3 Photos (Classic Strip)</option>
                    <option value={4}>4 Photos (Long Story)</option>
                  </select>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Each photo will tell a part of your story
                </p>
              </div>
              
              <div className="card-retro">
                <h3 className="text-xl font-bold text-bunny-pink mb-3">
                  Your Story Frames
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Array(captureCount).fill(null).map((_, idx) => (
                    <div key={idx} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                      {photos[idx] ? (
                        <img 
                          src={photos[idx]} 
                          alt={`Frame ${idx + 1}`} 
                          className="w-full h-full object-cover"
                          style={{ filter: 'grayscale(100%) contrast(120%) brightness(90%) sepia(25%)' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
                          📸
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs text-center py-1 font-mono">
                        Frame {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Vintage black & white • {cityVibeName.charAt(0).toUpperCase() + cityVibeName.slice(1)} vibes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vintage photostrip design screen with storytelling
  if (showStrip) {
    return (
      <div className="min-h-screen p-4">
        <CityTheme city={cityVibeName} />
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-vintage text-bunny-pink">
                🎞️ Tell Your Vintage Story
              </h1>
              <button
                onClick={() => navigate('/gallery')}
                className="text-bunny-pink hover:text-pink-600"
              >
                📸 Gallery
              </button>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PhotoStrip photos={photos} design={design} cityVibe={cityVibeName} />
              </div>
              
              <div className="space-y-6">
                {/* Story Captions Section */}
                <div className="card-retro">
                  <h3 className="text-xl font-bold text-bunny-pink mb-3">
                    📖 Write Your Story
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add a caption to each photo to tell your mini story
                  </p>
                  {Array(captureCount).fill(null).map((_, idx) => (
                    <div key={idx} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frame {idx + 1} caption:
                      </label>
                      <input
                        type="text"
                        placeholder={`e.g., "${storyExamples[idx % storyExamples.length]}"`}
                        value={design.captions?.[idx] || ''}
                        onChange={(e) => {
                          const newCaptions = [...(design.captions || [])];
                          newCaptions[idx] = e.target.value;
                          setDesign({ ...design, captions: newCaptions });
                        }}
                        className="w-full p-2 border border-lola-pink rounded-lg text-sm font-mono"
                      />
                    </div>
                  ))}
                  <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 italic">
                      💡 Tip: Your captions create a story across all {captureCount} frames
                    </p>
                  </div>
                </div>
                
                {/* Stickers */}
                <StickerPicker design={design} setDesign={setDesign} />
                
                {/* Print Button */}
                <PrintButton photos={photos} design={design} cityVibe={{ name: cityVibeName }} />
                
                {/* Vintage Quote */}
                <div className="text-center text-xs text-gray-400 italic">
                  "Every picture tells a story" 🎞️
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
};

export default Studio;