import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import GalaxyTheme from '../src/GalaxyTheme';

const ThreeScene = ({ children, theme, user, cameraPosition = [0, 0, 5], fov = 75 }) => {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={fov} />
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          {theme === 'galaxy' ? <GalaxyTheme user={user} /> : children}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeScene;