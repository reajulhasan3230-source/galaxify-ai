import React, { useRef, useState } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import ThemeWrapper from './ThemeWrapper';

const LavaMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color('#1a0505'),
    uColorEnd: new THREE.Color('#ff4500'),
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      float wave1 = sin(uv.x * 10.0 + uTime * 0.5);
      float wave2 = sin(uv.y * 8.0 - uTime * 0.8);
      float wave3 = sin((uv.x + uv.y) * 5.0 + uTime * 0.2);
      float distortion = (wave1 + wave2 + wave3) / 3.0;
      float mixFactor = smoothstep(-0.5, 1.0, distortion);
      mixFactor += (1.0 - uv.y) * 0.4;
      vec3 color = mix(uColorStart, uColorEnd, clamp(mixFactor, 0.0, 1.0));
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ LavaMaterial });

const LavaBackground = () => {
  const materialRef = useRef();
  useFrame((state, delta) => {
    if (materialRef.current) materialRef.current.uTime += delta;
  });
  return (
    <mesh scale={[100, 100, 1]} position={[0, 0, -10]}>
      <planeGeometry args={[1, 1]} />
      <lavaMaterial ref={materialRef} />
    </mesh>
  );
};

const PulsingCard = ({ project, position, delay = 0 }) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      const pulse = Math.sin(t * 2 + delay) * 0.05 + 1;
      const targetScale = hovered ? 1.2 : pulse;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={groupRef}>
            <mesh 
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
            >
                <boxGeometry args={[2.5, 1.5, 0.1]} />
                <meshStandardMaterial 
                    color="#1f1f1f" 
                    emissive="#ff4500"
                    emissiveIntensity={hovered ? 0.6 : 0.1}
                    roughness={0.3}
                />
            </mesh>
            <Text position={[0, 0.3, 0.06]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle" maxWidth={2}>
                {project.title || "Project Title"}
            </Text>
            <Text position={[0, -0.2, 0.06]} fontSize={0.1} color="#cccccc" anchorX="center" anchorY="top" maxWidth={2.2}>
                {project.description ? project.description.substring(0, 60) + "..." : "Description"}
            </Text>
        </group>
      </Float>
    </group>
  );
};

const LavaTheme = ({ user }) => {
  const projects = user?.projects?.length > 0 ? user.projects : [
    { title: "Strength Forge", description: "Fitness app." },
    { title: "Heat Map", description: "Data viz." },
    { title: "Volcanic UI", description: "Design system." },
  ];

  return (
    <ThemeWrapper pages={2}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffaa00" />
      <LavaBackground />
      <group position={[0, 0, 0]}>
        {projects.map((project, index) => {
            const x = (index - (projects.length - 1) / 2) * 3;
            return (
                <PulsingCard key={index} project={project} position={[x, 0, 0]} delay={index * 1.5} />
            );
        })}
      </group>
    </ThemeWrapper>
  );
};

export default LavaTheme;