import React, { createContext, useContext, useState, useEffect } from 'react';
import GalaxyTheme from './GalaxyTheme';
import LavaTheme from './LavaTheme';
import NeonTheme from './NeonTheme';
import ForestTheme from './ForestTheme';

const ThemeContext = createContext();

const themes = {
  galaxy: { id: 'galaxy', name: 'Galaxy', default: GalaxyTheme },
  lava: { id: 'lava', name: 'Lava', default: LavaTheme },
  neon: { id: 'neon', name: 'Neon', default: NeonTheme },
  forest: { id: 'forest', name: 'Forest', default: ForestTheme },
};

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState('galaxy');

  const value = {
    themeId,
    setTheme: setThemeId,
    theme: themes[themeId] || themes.galaxy,
    availableThemes: themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);