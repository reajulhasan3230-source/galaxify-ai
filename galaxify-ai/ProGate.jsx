import React from 'react';
import { useTheme } from './ThemeContext';

const PRO_THEMES = ['lava', 'neon', 'forest'];

const ProGate = ({ children, user }) => {
  const { themeId } = useTheme();
  
  // Check if current theme is Pro
  const isProTheme = PRO_THEMES.includes(themeId);
  
  // Check if user is on Free plan (default to free if no plan specified)
  const isFreeUser = !user?.plan || user.plan === 'free';
  
  const isLocked = isProTheme && isFreeUser;

  if (isLocked) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        {/* Blurred Background Content */}
        <div className="absolute inset-0 filter blur-2xl opacity-30 pointer-events-none select-none">
          {children}
        </div>

        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="text-center p-8 max-w-md border border-white/10 bg-gray-900/60 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-xl border-t border-l border-white/20">
            <div className="text-6xl mb-6 animate-bounce">💎</div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-3">
              Premium Theme
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              You are viewing the <strong>{themeId.charAt(0).toUpperCase() + themeId.slice(1)}</strong> theme. 
              <br />
              Upgrade to Pro to unlock this immersive 3D experience.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all duration-300">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProGate;