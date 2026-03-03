import React, { createContext, useContext, useState, useMemo } from 'react';

// Import theme configurations
// Assuming these files export the theme objects (colors, 3D settings, etc.)
import * as galaxy from '../src/GalaxyTheme';
import * as lava from '../src/LavaTheme';
import * as forest from '../src/ForestTheme';
import * as neon from '../src/NeonTheme';

const THEMES = {
  galaxy,
  lava,
  forest,
  neon,
};

const ThemeContext = createContext({
  themeId: 'galaxy',
  theme: THEMES.galaxy,
  setTheme: () => {},
  availableThemes: [],
});

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState('galaxy');

  const value = useMemo(() => {
    // Fallback to galaxy if the requested themeId doesn't exist
    const selectedTheme = THEMES[themeId] || THEMES.galaxy;
    
    return {
      themeId,
      theme: selectedTheme,
      setTheme: setThemeId,
      availableThemes: Object.keys(THEMES),
    };
  }, [themeId]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);