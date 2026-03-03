import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPortfolioByUsername } from '../galaxify-ai/portfolioService';
import { useTheme } from '../galaxify-ai/ThemeContext';
import ThreeScene from '../galaxify-ai/ThreeScene';
import GalaxyTheme from '../src/GalaxyTheme';
import LavaTheme from '../src/LavaTheme';
import ForestTheme from '../src/ForestTheme';
import NeonTheme from '../src/NeonTheme';

const PublicPortfolio = () => {
  const { username } = useParams();
  const { setTheme } = useTheme();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPortfolioByUsername(username);
        
        if (data) {
          setPortfolio(data);
          // If user has a saved theme, set it. Otherwise default to galaxy.
          // For free users, we might enforce 'galaxy' if they try to use others, 
          // but usually that check happens on save. Here we just render what's saved 
          // or fallback if they are free and somehow saved a pro theme (optional strict check).
          if (data.themeId) {
            setTheme(data.themeId);
          }
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error("Error loading portfolio:", err);
        setError('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username, setTheme]);

  if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading Universe...</div>;
  if (error) return <div className="h-screen bg-black text-white flex items-center justify-center">{error}</div>;
  if (!portfolio) return null;

  // Determine Theme Component
  // Free users might be restricted here if we want to be strict, 
  // but usually we just render what is saved. 
  // The prompt says "Free user: Limited theme".
  const isPro = portfolio.plan === 'pro';
  const activeThemeId = isPro ? (portfolio.themeId || 'galaxy') : 'galaxy'; // Force galaxy for free users if strict

  const renderTheme = () => {
    switch (activeThemeId) {
      case 'lava': return <LavaTheme user={portfolio} />;
      case 'forest': return <ForestTheme user={portfolio} />;
      case 'neon': return <NeonTheme user={portfolio} />;
      case 'galaxy':
      default: return <GalaxyTheme user={portfolio} />;
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <ThreeScene theme={activeThemeId} user={portfolio}>
        {renderTheme()}
      </ThreeScene>

      {/* Watermark for Free Users */}
      {!isPro && (
        <div className="absolute bottom-4 right-4 z-50 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-white/70">
            Powered by <span className="font-bold text-white">GALAXIFY</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicPortfolio;