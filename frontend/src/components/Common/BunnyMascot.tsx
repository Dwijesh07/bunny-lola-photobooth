import React from 'react';
import { motion } from 'framer-motion';

interface BunnyMascotProps {
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
}

const BunnyMascot: React.FC<BunnyMascotProps> = ({ size = 'medium', animate = true }) => {
  const sizes = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-8xl'
  };

  return (
    <motion.div
      animate={animate ? {
        y: [0, -10, 0],
        rotate: [0, -5, 5, 0]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      className={`${sizes[size]} cursor-pointer`}
    >
      🐰
    </motion.div>
  );
};

export default BunnyMascot;