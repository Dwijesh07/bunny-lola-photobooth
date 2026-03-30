import React from 'react';
import { motion } from 'framer-motion';

interface TemplateSelectorProps {
  design: any;
  setDesign: (design: any) => void;
}

const templates = [
  { id: 'classic', name: 'Classic Strip', icon: '📸', description: 'Traditional photobooth style' },
  { id: 'polaroid', name: 'Polaroid', icon: '🖼️', description: 'With caption space' },
  { id: 'scrapbook', name: 'Scrapbook', icon: '📔', description: 'With stickers and decorations' },
  { id: 'heart', name: 'Heart Frames', icon: '❤️', description: 'Heart-shaped frames' },
  { id: 'film', name: 'Film Strip', icon: '🎞️', description: 'Classic film look' }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ design, setDesign }) => {
  return (
    <div className="card-retro">
      <h3 className="text-xl font-bold text-bunny-pink mb-4">Choose Template 🎨</h3>
      <div className="grid grid-cols-2 gap-3">
        {templates.map(template => (
          <motion.button
            key={template.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDesign({ ...design, template: template.id })}
            className={`p-3 rounded-lg text-left transition-all ${
              design.template === template.id
                ? 'bg-bunny-pink text-white shadow-lg'
                : 'bg-white hover:bg-lola-pink'
            }`}
          >
            <div className="text-2xl mb-1">{template.icon}</div>
            <div className="font-bold text-sm">{template.name}</div>
            <div className="text-xs opacity-75">{template.description}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;