import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTimerProps {
  count: number;
  onComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ count, onComplete }) => {
  const [currentCount, setCurrentCount] = useState(count);

  useEffect(() => {
    if (currentCount > 0) {
      const timer = setTimeout(() => {
        setCurrentCount(currentCount - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [currentCount, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key={currentCount}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        className="text-8xl font-bold text-white bg-bunny-pink rounded-full w-32 h-32 flex items-center justify-center"
      >
        {currentCount === 0 ? '📸' : currentCount}
      </motion.div>
    </AnimatePresence>
  );
};

export default CountdownTimer;