import React from 'react';
import { motion } from 'framer-motion';

interface PDFPreviewProps {
  photos: string[];
  design: any;
  cityVibe: any;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ photos, design, cityVibe }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-xl p-6"
    >
      <h3 className="text-xl font-bold text-center text-bunny-pink mb-4">
        {cityVibe?.name || 'Melbourne'} Vibes ✨
      </h3>
      <div className="space-y-3">
        {photos.map((photo, idx) => (
          <div key={idx} className="border-2 border-lola-pink rounded-lg p-2">
            <img src={photo} alt={`Photo ${idx + 1}`} className="w-full rounded-lg" />
            {design.captions?.[idx] && (
              <p className="text-center text-sm mt-2 text-gray-600">{design.captions[idx]}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-gray-500">
        🐰 Made with love by Bunny & Lola
      </div>
    </motion.div>
  );
};

export default PDFPreview;