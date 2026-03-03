import React from 'react';

const OrbitingElements = ({ children, radius = 100 }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Ring */}
      <div className="absolute rounded-full border border-white/10 animate-spin" 
           style={{ width: radius * 2, height: radius * 2, animationDuration: '20s' }}>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
      </div>
      {/* Inner Ring */}
      <div className="absolute rounded-full border border-white/10 animate-spin" 
           style={{ width: radius * 1.5, height: radius * 1.5, animationDuration: '15s', animationDirection: 'reverse' }}>
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default OrbitingElements;