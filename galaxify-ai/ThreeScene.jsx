import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';

/**
 * ThreeScene Component
 * A reusable 3D background wrapper using React Three Fiber.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - 3D elements to render inside the scene (e.g., specific themes)
 * @param {Array} props.cameraPosition - [x, y, z] position of the camera
 * @param {number} props.fov - Field of view for the camera
 */
const ThreeScene = ({ children, cameraPosition = [0, 0, 5], fov = 75 }) => {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={fov} />
        
        {/* Basic Ambient Light to ensure objects are visible */}
        <ambientLight intensity={0.5} />
        
        <Suspense fallback={null}>
          {/* Default Starfield Background */}
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1} 
          />
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeScene;