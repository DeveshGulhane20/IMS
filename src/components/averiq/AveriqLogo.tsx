import React from 'react';

export const AVERIQ_LOGO_ASSET = '/assets/aistudio/Averiq_Intelligence_Logo_f607a30d.png';

interface AveriqLogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  tagline?: string;
  appName?: string;
  companyName?: string;
  showAppName?: boolean;
  showCompanyTagline?: boolean;
}

export const AveriqLogo: React.FC<AveriqLogoProps> = ({
  className = 'w-9 h-9',
  showText = true,
  textColor = 'text-white',
  subtextColor = 'text-blue-400',
  tagline,
  appName = 'IMS - Institution Management System',
  companyName = 'AVERIQ',
  showAppName = true,
  showCompanyTagline = true
}) => {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Official Averiq Logo Symbol Asset */}
      <div className={`relative shrink-0 flex items-center justify-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-white/20 overflow-hidden ${className}`}>
        <img
          src={AVERIQ_LOGO_ASSET}
          alt="AVERIQ - Intelligence in every solution"
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left justify-center min-w-0">
          {/* Company Brand & App Code Badge */}
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-base sm:text-lg tracking-tight leading-none ${textColor}`}>
              {companyName}
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-600/25 border border-blue-400/40 text-blue-300 font-mono font-bold text-[10px] tracking-wider uppercase leading-none">
              IMS
            </span>
          </div>

          {/* Tagline / Subtitle */}
          <div className="flex flex-col mt-0.5 leading-tight">
            {tagline ? (
              <span className={`text-[10px] font-semibold tracking-wide ${subtextColor}`}>
                {tagline}
              </span>
            ) : showCompanyTagline ? (
              <span className={`text-[10px] font-medium tracking-wide ${subtextColor}`}>
                Intelligence in every solution
              </span>
            ) : null}

            {showAppName && (
              <span className="text-[9px] text-slate-400 font-medium tracking-tight truncate">
                Institution Management System
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
