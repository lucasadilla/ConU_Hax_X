'use client';

// Pixel Cloud Component
function PixelCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect x="16" y="16" width="8" height="8" fill="white" fillOpacity="0.9"/>
      <rect x="24" y="8" width="8" height="8" fill="white" fillOpacity="0.9"/>
      <rect x="24" y="16" width="8" height="8" fill="white" fillOpacity="0.9"/>
      <rect x="32" y="8" width="8" height="8" fill="white" fillOpacity="0.9"/>
      <rect x="32" y="16" width="8" height="8" fill="white" fillOpacity="0.9"/>
      <rect x="40" y="16" width="8" height="8" fill="white" fillOpacity="0.9"/>
      <rect x="8" y="16" width="8" height="8" fill="white" fillOpacity="0.8"/>
      <rect x="48" y="16" width="8" height="8" fill="white" fillOpacity="0.8"/>
      <rect x="16" y="24" width="8" height="8" fill="white" fillOpacity="0.7"/>
      <rect x="40" y="24" width="8" height="8" fill="white" fillOpacity="0.7"/>
    </svg>
  );
}

// Small Pixel Cloud
function SmallCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect x="8" y="8" width="8" height="8" fill="white" fillOpacity="0.85"/>
      <rect x="16" y="8" width="8" height="8" fill="white" fillOpacity="0.85"/>
      <rect x="24" y="8" width="8" height="8" fill="white" fillOpacity="0.85"/>
      <rect x="12" y="16" width="8" height="8" fill="white" fillOpacity="0.7"/>
      <rect x="20" y="16" width="8" height="8" fill="white" fillOpacity="0.7"/>
    </svg>
  );
}

// Pixel Star decoration
function PixelStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} style={{ imageRendering: 'pixelated' }}>
      <rect x="7" y="0" width="2" height="4" fill="#fde047"/>
      <rect x="7" y="12" width="2" height="4" fill="#fde047"/>
      <rect x="0" y="7" width="4" height="2" fill="#fde047"/>
      <rect x="12" y="7" width="4" height="2" fill="#fde047"/>
      <rect x="6" y="6" width="4" height="4" fill="#fde047"/>
    </svg>
  );
}

export function SkyBackground() {
  return (
    <>
      {/* Sky Blue Gradient Background */}
      <div 
        className="fixed inset-0 -z-20"
        style={{
          background: 'linear-gradient(180deg, #7dd3fc 0%, #38bdf8 30%, #0ea5e9 60%, #0284c7 100%)',
        }}
      />
      
      {/* Pixel Clouds - Floating */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Large clouds */}
        <PixelCloud className="absolute w-32 h-16 top-[5%] left-[5%] animate-pulse opacity-90" />
        <PixelCloud className="absolute w-40 h-20 top-[8%] right-[10%] opacity-85" />
        <PixelCloud className="absolute w-36 h-18 top-[15%] left-[30%] opacity-80" />
        <PixelCloud className="absolute w-28 h-14 top-[12%] right-[35%] opacity-85" />
        <PixelCloud className="absolute w-32 h-16 top-[20%] left-[60%] opacity-75" />
        <PixelCloud className="absolute w-24 h-12 top-[25%] left-[15%] opacity-70" />
        <PixelCloud className="absolute w-30 h-15 top-[30%] right-[25%] opacity-65" />
        
        {/* Small clouds */}
        <SmallCloud className="absolute w-20 h-12 top-[3%] left-[45%] opacity-90" />
        <SmallCloud className="absolute w-16 h-10 top-[18%] right-[5%] opacity-80" />
        <SmallCloud className="absolute w-18 h-11 top-[22%] left-[80%] opacity-75" />
        <SmallCloud className="absolute w-14 h-8 top-[10%] left-[70%] opacity-85" />
        <SmallCloud className="absolute w-16 h-10 top-[35%] left-[40%] opacity-60" />
        
        {/* Decorative stars */}
        <PixelStar className="absolute w-4 h-4 top-[6%] left-[25%] animate-pulse" />
        <PixelStar className="absolute w-3 h-3 top-[14%] right-[20%] animate-pulse" style={{ animationDelay: '0.3s' }} />
        <PixelStar className="absolute w-5 h-5 top-[28%] left-[50%] animate-pulse" style={{ animationDelay: '0.5s' }} />
        <PixelStar className="absolute w-4 h-4 top-[10%] left-[85%] animate-pulse" style={{ animationDelay: '0.7s' }} />
        <PixelStar className="absolute w-3 h-3 top-[32%] right-[15%] animate-pulse" style={{ animationDelay: '0.2s' }} />
        <PixelStar className="absolute w-4 h-4 top-[38%] left-[20%] animate-pulse" style={{ animationDelay: '0.9s' }} />
      </div>
    </>
  );
}

export default SkyBackground;
