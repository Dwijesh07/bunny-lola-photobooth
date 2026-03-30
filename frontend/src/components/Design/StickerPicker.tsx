import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StickerPickerProps {
  design: any;
  setDesign: (design: any) => void;
}

const stickers = [
  { id: 'bunny', emoji: '🐰', name: 'Bunny' },
  { id: 'heart', emoji: '❤️', name: 'Heart' },
  { id: 'star', emoji: '⭐', name: 'Star' },
  { id: 'flower', emoji: '🌸', name: 'Flower' },
  { id: 'camera', emoji: '📸', name: 'Camera' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
  { id: 'sparkles', emoji: '✨', name: 'Sparkles' }
];

const StickerPicker: React.FC<StickerPickerProps> = ({ design, setDesign }) => {
  const [showPicker, setShowPicker] = useState(false);

  const addSticker = (sticker: typeof stickers[0]) => {
    setDesign({
      ...design,
      stickers: [...design.stickers, sticker]
    });
  };

  const removeSticker = (index: number) => {
    const newStickers = [...design.stickers];
    newStickers.splice(index, 1);
    setDesign({ ...design, stickers: newStickers });
  };

  return (
    <div className="card-retro">
      <h3 className="text-xl font-bold text-bunny-pink mb-4">Add Stickers 🎀</h3>
      
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="w-full btn-outline-pink mb-3"
      >
        {showPicker ? 'Hide Stickers' : '✨ Choose a Sticker'}
      </button>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-4 gap-2 mb-4 overflow-hidden"
          >
            {stickers.map(sticker => (
              <button
                key={sticker.id}
                onClick={() => addSticker(sticker)}
                className="text-3xl p-2 hover:bg-lola-pink rounded-lg transition-colors"
              >
                {sticker.emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {design.stickers.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Your stickers:</p>
          <div className="flex flex-wrap gap-2">
            {design.stickers.map((sticker: any, idx: number) => (
              <div
                key={idx}
                className="relative group cursor-pointer"
                onClick={() => removeSticker(idx)}
              >
                <span className="text-2xl">{sticker.emoji}</span>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ×
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StickerPicker;