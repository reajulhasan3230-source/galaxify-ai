import React, { useEffect, useRef, useState } from 'react';

const Interactive3DBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Particle system
    const particles = [];
    const particleCount = prefersReducedMotion ? 50 : 150;
    const maxDistance = 150;
    const mouseInfluence = 100;

    // Color palette
    const colors = [
      'rgba(59, 130, 246, 0.8)',   // Blue
      'rgba(139, 92, 246, 0.8)',   // Violet
      'rgba(6, 182, 212, 0.8)',    // Cyan
      'rgba(167, 139, 250, 0.8)',  // Purple
    ];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        connections: [],
      });
    }

    let animationFrameId;
    let time = 0;

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      time += 0.016;

      // Draw background with radial gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, '#0a0520');
      gradient.addColorStop(0.5, '#050315');
      gradient.addColorStop(1, '#030213');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebula effect
      if (!prefersReducedMotion) {
        ctx.globalCompositeOperation = 'screen';
        
        // Animated nebula
        const nebulaX = canvas.width / 2 + Math.sin(time * 0.3) * 100;
        const nebulaY = canvas.height / 2 + Math.cos(time * 0.2) * 80;
        
        const nebula = ctx.createRadialGradient(
          nebulaX,
          nebulaY,
          0,
          nebulaX,
          nebulaY,
          canvas.width * 0.4
        );
        nebula.addColorStop(0, 'rgba(139, 92, 246, 0.08)');
        nebula.addColorStop(0.5, 'rgba(59, 130, 246, 0.04)');
        nebula.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = nebula;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'source-over';
      }

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Mouse interaction
        if (!prefersReducedMotion) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseInfluence) {
            const force = (mouseInfluence - distance) / mouseInfluence;
            particle.vx += (dx / distance) * force * 0.2;
            particle.vy += (dy / distance) * force * 0.2;
          }
        }

        // Update position with 3D depth
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Apply friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Boundary check with wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.z < 0) particle.z = 1000;
        if (particle.z > 1000) particle.z = 0;

        // Calculate depth scale
        const scale = 1000 / (1000 + particle.z);
        const depth = scale * 3;

        // Draw connections (reduced for performance)
        if (!prefersReducedMotion && i % 2 === 0) {
          for (let j = i + 1; j < particles.length; j++) {
            const other = particles[j];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
              const opacity = (1 - distance / maxDistance) * 0.15;
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        }

        // Draw particle with glow
        const glowSize = particle.size * depth * 4;
        const particleGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          glowSize
        );

        const baseOpacity = particle.opacity * scale;
        particleGradient.addColorStop(0, particle.color.replace('0.8', String(baseOpacity)));
        particleGradient.addColorStop(0.3, particle.color.replace('0.8', String(baseOpacity * 0.3)));
        particleGradient.addColorStop(1, particle.color.replace('0.8', '0'));

        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw bright core
        ctx.fillStyle = `rgba(255, 255, 255, ${baseOpacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * depth * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
      aria-hidden="true"
    />
  );
};

export default Interactive3DBackground;