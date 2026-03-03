import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Cloud } from '@react-three/drei';
import ThemeWrapper from './ThemeWrapper';

const FloatingLeaf = ({ position }) => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y -= 0.01;
      if (meshRef.current.position.y < -5) meshRef.current.position.y = 5;
    }
  });
  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.2, 0.2]} />
      <meshStandardMaterial color="#4ade80" side={2} />
    </mesh>
  );
};

const ForestTheme = ({ user }) => {
  const projects = user?.projects?.length > 0 ? user.projects : [
    { title: "Eco Tracker", description: "Sustainability app." },
    { title: "Green UI", description: "Nature inspired design." },
  ];

  return (
    <ThemeWrapper pages={2}>
      <color attach="background" args={['#0f172a']} />
      <fog attach="fog" args={['#0f172a', 5, 15]} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#86efac" />

      {/* Floating Leaves */}
      {Array.from({ length: 50 }).map((_, i) => (
        <FloatingLeaf 
          key={i} 
          position={[
            (Math.random() - 0.5) * 10, 
            (Math.random() - 0.5) * 10, 
            (Math.random() - 0.5) * 5
          ]} 
        />
      ))}

      <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} />

      <group position={[0, 0, 0]}>
        {projects.map((project, index) => (
          <Float key={index} speed={2} rotationIntensity={0.2} floatIntensity={1}>
            <group position={[(index - 0.5) * 4, 0, 0]}>
              <Text fontSize={0.4} color="#bbf7d0" anchorX="center" anchorY="middle">
                {project.title}
              </Text>
            </group>
          </Float>
        ))}
      </group>
    </ThemeWrapper>
  );
};

export default ForestTheme;