import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPortfolioByUsername } from './portfolioService';
import { useTheme } from './ThemeContext';
import ThreeScene from './ThreeScene';
import ProGate from './ProGate';

// Space Nebula Spinner Component
const NebulaSpinner = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-black text-white z-50 relative overflow-hidden">
    {/* Background Glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
    
    <div className="relative w-32 h-32">
      {/* Outer Orbit */}
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 border-b-purple-600 animate-spin" style={{ animationDuration: '3s' }}></div>
      
      {/* Inner Orbit (Reverse) */}
      <div className="absolute inset-4 rounded-full border-4 border-transparent border-l-cyan-500 border-r-cyan-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
      
      {/* Core Star */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.9)] animate-pulse"></div>
      </div>
    </div>
    
    <h2 className="mt-8 text-sm font-bold tracking-[0.5em] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 animate-pulse">
      LOADING UNIVERSE
    </h2>
  </div>
);

const Portfolio = () => {
  const { username } = useParams();
  const { setTheme, theme } = useTheme();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch data and add a minimum delay to prevent flickering and show off the spinner
        const [data] = await Promise.all([
          getPortfolioByUsername(username),
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);

        if (!isMounted) return;

        if (data) {
          setPortfolio(data);
          // Dynamically set the global theme based on user's preference
          if (data.themeId) {
            setTheme(data.themeId);
          }
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error("Error loading portfolio:", err);
        if (isMounted) setError('Failed to load portfolio data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [username, setTheme]);

  // Extract the component from the theme module
  const ActiveTheme = theme?.default;

  if (loading) return <NebulaSpinner />;

  if (error) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white">
        <div className="text-6xl mb-4">🪐</div>
        <h1 className="text-4xl font-bold text-red-500 mb-2">404</h1>
        <p className="text-xl text-gray-400 mb-8">{error}</p>
        <Link to="/" className="px-6 py-2 border border-gray-700 rounded hover:bg-gray-800 transition-colors">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <ProGate user={portfolio}>
        <ThreeScene>
          {ActiveTheme && <ActiveTheme user={portfolio} />}
        </ThreeScene>
      </ProGate>
      
      {/* Watermark for Free Users */}
      {portfolio?.plan !== 'pro' && (
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
    </div>
  );
};

export default Portfolio;