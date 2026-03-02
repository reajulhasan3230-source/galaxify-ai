import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThreeScene from '../components/ThreeScene';
import ProGate from '../components/ProGate';

const Preview = ({ user = { plan: 'free' } }) => {
  const { theme: globalTheme, themeId } = useTheme();
  
  // Local state to manage the delayed switch for smooth transitions
  const [displayTheme, setDisplayTheme] = useState(globalTheme);
  const [opacity, setOpacity] = useState(100);

  // Dynamic component loader from the locally displayed theme
  const SelectedTheme = displayTheme?.default;

  // Handle smooth transition: Fade Out -> Switch Theme -> Fade In
  useEffect(() => {
    if (globalTheme !== displayTheme) {
      // 1. Start fade out
      setOpacity(0);
      
      // 2. Wait for fade out to finish (matching duration-700)
      const timer = setTimeout(() => {
        setDisplayTheme(globalTheme);
        setOpacity(100); // 3. Start fade in
      }, 700);
      
      return () => clearTimeout(timer);
    }
  }, [globalTheme, displayTheme]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* 3D Scene Wrapper */}
      <div className={`w-full h-full transition-opacity duration-700 ease-in-out ${opacity === 100 ? 'opacity-100' : 'opacity-0'}`}>
        <ProGate user={user}>
          <ThreeScene>
            {SelectedTheme && (
              <SelectedTheme user={user} />
            )}
          </ThreeScene>
        </ProGate>
      </div>

      {/* Watermark - Only visible for Free users (ProGate handles the lock overlay) */}
      {user?.plan !== 'pro' && (
        <div className="absolute bottom-6 right-6 z-40 pointer-events-none select-none">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-semibold text-gray-200 tracking-wide uppercase">
              Powered by Galaxify AI
            </span>
          </div>
        </div>
      )}
      
      {/* Preview Indicator */}
      <div className="absolute top-4 left-4 z-40 pointer-events-none">
        <div className="bg-gray-900/80 backdrop-blur text-white px-3 py-1.5 rounded-lg border border-gray-700 shadow-lg">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Preview Mode</p>
            <p className="font-bold capitalize text-sm">{themeId}</p>
        </div>
      </div>
    </div>
  );
};

export default Preview;