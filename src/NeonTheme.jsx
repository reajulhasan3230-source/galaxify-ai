import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Grid } from '@react-three/drei';
import ThemeWrapper from './ThemeWrapper';

const NeonBox = ({ position, color }) => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });
  return (
    <Box ref={meshRef} args={[1, 1, 1]} position={position}>
      <meshStandardMaterial color="black" emissive={color} emissiveIntensity={2} wireframe />
    </Box>
  );
};

const NeonTheme = ({ user }) => {
  const projects = user?.projects?.length > 0 ? user.projects : [
    { title: "Cyber Deck", description: "Hacking simulator." },
    { title: "Neon Synth", description: "Music visualizer." },
  ];

  return (
    <ThemeWrapper pages={2}>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 5, 20]} />
      <ambientLight intensity={0.1} />
      
      {/* Cyberpunk Grid */}
      <Grid 
        position={[0, -2, 0]} 
        args={[20, 20]} 
        cellSize={0.5} 
        cellThickness={1} 
        cellColor="#00ffff" 
        sectionSize={2} 
        sectionThickness={1.5} 
        sectionColor="#ff00ff" 
        fadeDistance={15} 
      />

      <group position={[0, 0, 0]}>
        {projects.map((project, index) => (
          <group key={index} position={[(index - 0.5) * 4, 0, 0]}>
            <NeonBox position={[0, 1, 0]} color={index % 2 === 0 ? "#00ffff" : "#ff00ff"} />
            <Text position={[0, -0.5, 0]} fontSize={0.3} color="white" anchorX="center">
              {project.title}
            </Text>
          </group>
        ))}
      </group>
    </ThemeWrapper>
  );
};

export default NeonTheme;