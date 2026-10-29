import React from 'react';

export const AV_ACHIEVERS_LOGO = '/assets/aistudio/WhatsApp_Image_2026-10-28_at_9.50.44_PM__1__a1189775.jpeg';
export const IMS_GRAD_LOGO = '/assets/aistudio/image_22534877.png';
export const AVERIQ_LOGO = '/assets/aistudio/Averiq_Intelligence_Logo_f607a30d.png';

interface AveriqLogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  tagline?: string;
  collapsed?: boolean;
  variant?: 'institute' | 'ims' | 'compact';
}

export const AveriqLogo: React.FC<AveriqLogoProps> = ({
  className = 'w-10 h-10',
  showText = true,
  textColor = 'text-white',
  subtextColor = 'text-sky-300',
  tagline,
  collapsed = false,
  variant = 'institute'
}) => {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center justify-center select-none" title="AV Achievers - Institute Management System">
        <div className={`relative shrink-0 flex items-center justify-center rounded-xl bg-white p-1 shadow-md ring-1 ring-white/20 overflow-hidden ${className}`}>
          <img
            src={AV_ACHIEVERS_LOGO}
            alt="AV Achievers"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-[9px] font-mono font-black text-blue-400 mt-1 uppercase tracking-wider">
          IMS
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 select-none min-w-0">
      {/* Official AV Achievers Institute Logo Badge */}
      <div className={`relative shrink-0 flex items-center justify-center rounded-xl bg-white p-1 shadow-md ring-1 ring-white/20 overflow-hidden ${className}`}>
        <img
          src={AV_ACHIEVERS_LOGO}
          alt="AV Achievers Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left justify-center min-w-0 leading-tight">
          {/* Primary Institute Brand Name */}
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black text-base sm:text-[17px] tracking-tight ${textColor}`}>
              AV <span className="text-[#F97316]">ACHIEVERS</span>
            </span>
          </div>

          {/* Subtitle Text: "INSTITUTE MANAGEMENT SYSTEM" in a single clean line */}
          <div className={`text-[9.5px] sm:text-[10px] font-bold tracking-wider uppercase mt-1 whitespace-nowrap leading-tight ${subtextColor}`}>
            INSTITUTE MANAGEMENT SYSTEM
          </div>
        </div>
      )}
    </div>
  );
};
