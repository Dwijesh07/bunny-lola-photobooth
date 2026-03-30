import React from 'react';
import { motion } from 'framer-motion';

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const cities = {
  australian: [
    { id: 'melbourne', name: 'Melbourne', icon: '🎨', vibe: 'Laneway vibes, street art' },
    { id: 'sydney', name: 'Sydney', icon: '🏖️', vibe: 'Beach vibes, sunny' },
    { id: 'brisbane', name: 'Brisbane', icon: '🌴', vibe: 'Tropical, lush green' },
    { id: 'perth', name: 'Perth', icon: '🌅', vibe: 'Sunset vibes' },
    { id: 'adelaide', name: 'Adelaide', icon: '🍷', vibe: 'Wine country' }
  ],
  international: [
    { id: 'newyork', name: 'New York', icon: '🗽', vibe: 'Urban, neon lights' },
    { id: 'paris', name: 'Paris', icon: '🥐', vibe: 'Romantic, vintage chic' },
    { id: 'tokyo', name: 'Tokyo', icon: '🌸', vibe: 'Cherry blossoms, kawaii' },
    { id: 'london', name: 'London', icon: '☔', vibe: 'Classic, rainy aesthetic' },
    { id: 'santorini', name: 'Santorini', icon: '🏛️', vibe: 'White and blue' }
  ],
  seasonal: [
    { id: 'summer', name: 'Summer', icon: '☀️', vibe: 'Beach, sunshine' },
    { id: 'winter', name: 'Winter', icon: '❄️', vibe: 'Snow, cozy' },
    { id: 'autumn', name: 'Autumn', icon: '🍂', vibe: 'Warm oranges' },
    { id: 'spring', name: 'Spring', icon: '🌷', vibe: 'Pastels, flowers' }
  ]
};

const CitySelector: React.FC<CitySelectorProps> = ({ selectedCity, onCityChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-bunny-pink">Choose Your City Vibe ✨</h3>
      
      {Object.entries(cities).map(([category, cityList]) => (
        <div key={category}>
          <h4 className="text-sm font-semibold text-gray-600 mb-2 capitalize">{category}</h4>
          <div className="grid grid-cols-2 gap-2">
            {cityList.map(city => (
              <motion.button
                key={city.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCityChange(city.id)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedCity === city.id
                    ? 'bg-bunny-pink text-white shadow-lg'
                    : 'bg-white hover:bg-lola-pink'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{city.icon}</span>
                  <div>
                    <div className="font-bold">{city.name}</div>
                    <div className="text-xs opacity-75">{city.vibe}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CitySelector;