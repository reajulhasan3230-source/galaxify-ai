import React from 'react';
import { ScrollControls, Scroll } from '@react-three/drei';

const ThemeWrapper = ({ children, pages = 3, damping = 0.2 }) => {
  return (
    <ScrollControls pages={pages} damping={damping}>
      <Scroll>
        {children}
      </Scroll>
      {/* Future: Add <Scroll html> here for HTML content overlay */}
    </ScrollControls>
  );
};

export default ThemeWrapper;