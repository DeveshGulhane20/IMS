import React from 'react';

interface AveriqLogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  tagline?: string;
}

export const AveriqLogo: React.FC<AveriqLogoProps> = ({
  className = 'w-8 h-8',
  showText = true,
  textColor = 'text-white',
  subtextColor = 'text-blue-400',
  tagline = 'Smart Education, Better Future'
}) => {
  return (
    <div className="flex items-center gap-2.5">
      {/* Averiq Signature Blue Ribbon / Origami Arrow Logo */}
      <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="averiqRibbon1" x1="10%" y1="100%" x2="90%" y2="0%">
              <stop offset="0%" stopColor="#0056D6" />
              <stop offset="60%" stopColor="#007BFF" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="averiqRibbon2" x1="0%" y1="20%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#0041B8" />
              <stop offset="100%" stopColor="#0066FF" />
            </linearGradient>
            <linearGradient id="averiqFold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#0056D6" />
            </linearGradient>
          </defs>
          {/* Main Left Arrow-Ribbon Wing */}
          <path
            d="M8 35L19.5 8L27 18L15 35H8Z"
            fill="url(#averiqRibbon1)"
          />
          {/* Right Fold Ribbon Section */}
          <path
            d="M21 16L30 28L36 35H25.5L19 25.5L14 32H9.5L17.5 20.5L21 16Z"
            fill="url(#averiqRibbon2)"
          />
          {/* Diagonal Ribbon Highlight Crest */}
          <path
            d="M19.5 8L27 18L21 21L15.5 13.5L19.5 8Z"
            fill="url(#averiqFold)"
          />
          {/* Translucent Origami Shadow Detail */}
          <path
            d="M17.5 20.5L25.5 32H30.5L21 18.5L17.5 20.5Z"
            fill="#0284C7"
            fillOpacity="0.45"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-black text-xl tracking-tight leading-none ${textColor}`}>
            Averiq
          </span>
          {tagline && (
            <span className={`text-[10px] tracking-wide font-medium mt-0.5 ${subtextColor}`}>
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
