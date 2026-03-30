import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

interface PhotoStripProps {
  photos: string[];
  design: any;
  cityVibe?: string;
}

const PhotoStrip: React.FC<PhotoStripProps> = ({ photos, design, cityVibe = 'melbourne' }) => {
  const stripRef = useRef<HTMLDivElement>(null);

  // City-specific vintage paper colors and footer text
  const cityStyles: Record<string, { bg: string; footer: string; grain: string }> = {
    melbourne: { 
      bg: '#f5e6d3', 
      footer: 'MELBOURNE • LANEWAY EDITION • VINTAGE',
      grain: 'contrast(110%) brightness(95%) sepia(15%)'
    },
    sydney: { 
      bg: '#f5e8d9', 
      footer: 'SYDNEY • BEACH EDITION • VINTAGE',
      grain: 'contrast(105%) brightness(102%) sepia(10%)'
    },
    tokyo: { 
      bg: '#f0e6e8', 
      footer: 'TOKYO • CHERRY BLOSSOM EDITION • VINTAGE',
      grain: 'contrast(102%) brightness(100%) sepia(8%)'
    },
    paris: { 
      bg: '#f2e8e0', 
      footer: 'PARIS • ROMANTIC EDITION • VINTAGE',
      grain: 'contrast(100%) brightness(98%) sepia(20%)'
    },
    london: { 
      bg: '#e5e0d8', 
      footer: 'LONDON • FOGGY EDITION • VINTAGE',
      grain: 'contrast(112%) brightness(92%) sepia(5%)'
    },
    default: { 
      bg: '#f5e6d3', 
      footer: 'BUNNY & LOLA • PHOTOBOOTH • VINTAGE',
      grain: 'contrast(110%) brightness(95%) sepia(15%)'
    }
  };

  const cityStyle = cityStyles[cityVibe] || cityStyles.default;

  const downloadStrip = async () => {
    if (stripRef.current) {
      const canvas = await html2canvas(stripRef.current, {
        scale: 3,
        backgroundColor: cityStyle.bg,
        useCORS: true,
        logging: false
      });
      const link = document.createElement('a');
      link.download = `bunny-lola-${cityVibe}-vintage.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block shadow-2xl"
      >
        <div
          ref={stripRef}
          className="rounded-sm overflow-hidden"
          style={{
            fontFamily: "'Courier New', 'American Typewriter', monospace",
            backgroundColor: cityStyle.bg
          }}
        >
          {/* Film strip top */}
          <div className="h-5 bg-black bg-opacity-20 flex justify-around items-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-black bg-opacity-40"></div>
            ))}
          </div>
          
          {/* Photos with vintage black & white filter */}
          {photos.map((photo, idx) => (
            <div key={idx} className="relative border-b border-black border-opacity-10">
              <div className="p-3">
                <div className="relative overflow-hidden rounded-sm">
                  {/* Apply STRONG vintage black & white filter */}
                  <img
                    src={photo}
                    alt={`Frame ${idx + 1}`}
                    className="w-80 h-80 object-cover"
                    style={{
                      filter: 'grayscale(100%) contrast(130%) brightness(85%) sepia(30%)',
                      WebkitFilter: 'grayscale(100%) contrast(130%) brightness(85%) sepia(30%)'
                    }}
                  />
                  {/* Film grain overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.25'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'repeat',
                      opacity: 0.4,
                      mixBlendMode: 'overlay'
                    }}
                  />
                </div>
                
                {/* Vintage corner wear */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-black border-opacity-20"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-black border-opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-black border-opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-black border-opacity-20"></div>
                
                {/* Caption */}
                <div className="text-center mt-3">
                  {design.captions?.[idx] && (
                    <p className="text-sm italic text-gray-700 tracking-wide font-medium">
                      "{design.captions[idx]}"
                    </p>
                  )}
                </div>
              </div>
              
              {/* Divider with vintage dots */}
              {idx < photos.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-black bg-opacity-30"></div>
                    <div className="w-1 h-1 rounded-full bg-black bg-opacity-30"></div>
                    <div className="w-1 h-1 rounded-full bg-black bg-opacity-30"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Film strip bottom */}
          <div className="h-5 bg-black bg-opacity-20 flex justify-around items-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-black bg-opacity-40"></div>
            ))}
          </div>
          
          {/* Vintage footer */}
          <div className="text-center py-3 bg-black bg-opacity-5">
            <p className="text-[9px] tracking-[2px] text-gray-700 uppercase font-bold">
              {cityStyle.footer}
            </p>
            <p className="text-[7px] text-gray-500 mt-1 font-mono">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-[6px] text-gray-400 mt-1">
              🎞️ every picture tells a story • shot on film
            </p>
          </div>
        </div>
      </motion.div>
      
      <button
        onClick={downloadStrip}
        className="mt-6 btn-pink flex items-center gap-3 px-8 py-3 text-lg"
      >
        <span className="text-2xl">🎞️</span>
        <span>Download Vintage Strip</span>
      </button>
    </div>
  );
};

export default PhotoStrip;