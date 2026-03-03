import React from 'react';
import { useTheme } from '../../galaxify-ai/ThemeContext';
import ThreeScene from '../../galaxify-ai/ThreeScene';
import LavaTheme from '../src/LavaTheme';
import ForestTheme from '../src/ForestTheme';
import NeonTheme from '../src/NeonTheme';

const PreviewPortfolio = () => {
  const { themeId } = useTheme();

  // Mock user data for preview purposes
  const user = {
    projects: [
      { title: "Project Alpha", description: "A cool 3D project" },
      { title: "Project Beta", description: "Another awesome app" },
      { title: "Project Gamma", description: "React Three Fiber demo" }
    ]
  };

  // Helper to render the correct theme component
  // Note: GalaxyTheme is handled internally by ThreeScene when theme="galaxy"
  const renderTheme = () => {
    switch (themeId) {
      case 'lava': return <LavaTheme user={user} />;
      case 'forest': return <ForestTheme user={user} />;
      case 'neon': return <NeonTheme user={user} />;
      default: return null; 
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <ThreeScene theme={themeId} user={user}>
        {renderTheme()}
      </ThreeScene>
      
      {/* Overlay for Preview Context */}
      <div className="absolute top-6 left-6 z-50 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
          <h1 className="text-white font-bold text-lg">Portfolio Preview</h1>
          <p className="text-blue-300 text-sm capitalize">{themeId} Theme</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewPortfolio;