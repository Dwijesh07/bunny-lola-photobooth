import React from 'react';

interface CityThemeProps {
  city: string | null;
}

const CityTheme: React.FC<CityThemeProps> = ({ city }) => {
  const themes: Record<string, { bg: string; accent: string; pattern: string }> = {
    melbourne: { bg: 'from-pink-100 to-orange-100', accent: 'bg-pink-500', pattern: 'street-art' },
    sydney: { bg: 'from-yellow-100 to-orange-100', accent: 'bg-yellow-500', pattern: 'waves' },
    brisbane: { bg: 'from-green-100 to-teal-100', accent: 'bg-green-500', pattern: 'leaves' },
    paris: { bg: 'from-pink-100 to-purple-100', accent: 'bg-purple-500', pattern: 'eiffel' },
    tokyo: { bg: 'from-pink-100 to-red-100', accent: 'bg-red-500', pattern: 'cherry-blossom' },
    default: { bg: 'from-pink-100 to-rose-100', accent: 'bg-pink-500', pattern: 'dots' }
  };

  const theme = themes[city || 'default'] || themes.default;

  return (
    <div className={`fixed inset-0 bg-gradient-to-br ${theme.bg} -z-10 pointer-events-none`}>
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 3}s infinite`
            }}
          >
            {city === 'melbourne' && '🎨'}
            {city === 'sydney' && '🏖️'}
            {city === 'brisbane' && '🌴'}
            {city === 'perth' && '🌅'}
            {city === 'adelaide' && '🍷'}
            {city === 'tokyo' && '🌸'}
            {city === 'paris' && '🥐'}
            {city === 'newyork' && '🗽'}
            {city === 'london' && '☔'}
            {!city && '🐰'}
          </div>
        ))}
      </div>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
        `}
      </style>
    </div>
  );
};

export default CityTheme;