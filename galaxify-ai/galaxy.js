import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

/**
 * StarField Component
 * Creates a dense field of particles using Points and PointsMaterial
 */
const StarField = ({ count = 3000 }) => {
  const pointsRef = useRef();

  // Generate random positions for the stars
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Random spherical distribution
      const r = 10 + Math.random() * 40; // Radius between 10 and 50
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Slow rotation of the entire starfield
      pointsRef.current.rotation.y -= delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};

/**
 * ProjectNode Component
 * Represents a single project as an orbiting planet/star with a label
 */
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

        {hovered && (
          <Html distanceFactor={12} position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
            <div className="bg-slate-900/90 text-white p-3 rounded-lg border border-cyan-500 w-48 backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <h4 className="font-bold text-cyan-400 mb-1">{project.title}</h4>
              <p className="text-xs text-gray-300 line-clamp-3">
                {project.description || "No description available."}
              </p>
            </div>
          </Html>
        )}
      </Float>
    </group>
  );
};

const GalaxyTheme = ({ user }) => {
  const orbitGroupRef = useRef();
  const mainGroupRef = useRef();
  
  // Default projects if none provided (for preview/dev)
  const projects = user?.projects?.length > 0 ? user.projects : [
    { title: "Portfolio V1", description: "Initial release of the portfolio." },
    { title: "AI Generator", description: "Generative AI integration." },
    { title: "Three.js Demo", description: "3D graphics showcase." },
  ];

  useFrame((state, delta) => {
    if (orbitGroupRef.current) {
      // Rotate the project orbit ring
      orbitGroupRef.current.rotation.y += delta * 0.1;
    }

    if (mainGroupRef.current) {
      // Parallax tilt effect based on mouse position
      const { x, y } = state.mouse;
      // Lerp rotation for smooth movement
      mainGroupRef.current.rotation.x = THREE.MathUtils.lerp(mainGroupRef.current.rotation.x, -y * 0.1, 0.05);
      mainGroupRef.current.rotation.y = THREE.MathUtils.lerp(mainGroupRef.current.rotation.y, x * 0.1, 0.05);
    }
  });

  const orbitRadius = 5;

  return (
    <group ref={mainGroupRef}>
      {/* Lighting for the scene */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#fbbf24" distance={20} />

      {/* Central Core (Sun/Black Hole Accretion Disk) */}
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

      {/* Background Starfield */}
      <StarField count={4000} />

      {/* Orbiting Projects Ring */}
      <group ref={orbitGroupRef} rotation={[0.3, 0, 0]}> {/* Tilted orbit */}
        {projects.map((project, index) => {
          const angle = (index / projects.length) * Math.PI * 2;
          const x = Math.cos(angle) * orbitRadius;
          const z = Math.sin(angle) * orbitRadius;

          return (
            <ProjectNode
              key={index}
              project={project}
              position={[x, 0, z]}
              onClick={(p) => console.log("Clicked project:", p.title)}
            />
          );
        })}
      </group>
    </group>
  );
};

export default GalaxyTheme;