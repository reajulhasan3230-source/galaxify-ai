import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import ThemeWrapper from './ThemeWrapper';

const ProjectNode = ({ project, position, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((state) => {
    if (hovered && meshRef.current) {
      meshRef.current.rotation.y += 0.05;
      meshRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onClick={() => onClick && onClick(project)}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
        >
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color={hovered ? "#00ffff" : "#818cf8"}
            emissive={hovered ? "#00ffff" : "#4f46e5"}
            emissiveIntensity={hovered ? 2 : 0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        <Text
          position={[0, 0.6, 0]}
          fontSize={0.25}
          color={hovered ? "#00ffff" : "white"}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {project.title || "Project"}
        </Text>
      </Float>
    </group>
  );
};

const GalaxyTheme = ({ user }) => {
  const orbitGroupRef = useRef();
  const mainGroupRef = useRef();
  
  const projects = user?.projects?.length > 0 ? user.projects : [
    { title: "Portfolio V1", description: "Initial release." },
    { title: "AI Generator", description: "Generative AI." },
    { title: "Three.js Demo", description: "3D graphics." },
  ];

  useFrame((state, delta) => {
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += delta * 0.05;
    }
    if (mainGroupRef.current) {
      const { x, y } = state.mouse;
      mainGroupRef.current.rotation.x = THREE.MathUtils.lerp(mainGroupRef.current.rotation.x, -y * 0.1, 0.05);
      mainGroupRef.current.rotation.y = THREE.MathUtils.lerp(mainGroupRef.current.rotation.y, x * 0.1, 0.05);
    }
  });

  const orbitRadius = 5;

  return (
    <ThemeWrapper pages={2}>
      <group ref={mainGroupRef}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#fbbf24" distance={20} />

        {/* Central Core */}
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          <Sphere args={[1.2, 64, 64]}>
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.5}
              roughness={0.4}
            />
          </Sphere>
        </Float>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Orbiting Projects */}
        <group ref={orbitGroupRef} rotation={[0.3, 0, 0]}>
          {projects.map((project, index) => {
            const angle = (index / projects.length) * Math.PI * 2;
            const x = Math.cos(angle) * orbitRadius;
            const z = Math.sin(angle) * orbitRadius;
            return (
              <ProjectNode
                key={index}
                project={project}
                position={[x, 0, z]}
              />
            );
          })}
        </group>
      </group>
    </ThemeWrapper>
  );
};

export default GalaxyTheme;