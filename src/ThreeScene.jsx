import React from 'react';
import { Canvas } from '@react-three/fiber';

const ThreeScene = ({ children }) => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      {children}
    </Canvas>
  );
};

export default ThreeScene;