import React, { useEffect, useRef } from 'react';

const SolarSystemBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 7 Planets with increased orbitSpeed (0.02 - 0.04)
    const planets = [
      { radius: 140, orbitSpeed: 0.04, size: 8, colors: ['#bc13fe', '#7c3aed'] },   // Neon Purple
      { radius: 200, orbitSpeed: 0.035, size: 11, colors: ['#00f2ff', '#3b82f6'] },   // Cyan
      { 
        radius: 280, 
        orbitSpeed: 0.03, 
        size: 14, 
        colors: ['#ff00ff', '#d946ef'],
        moon: { orbitRadius: 45, orbitSpeed: 0.05, size: 8, color: '#ffffff' }
      },   // Magenta (Earth position) with Big White Moon
      { radius: 360, orbitSpeed: 0.025, size: 16, colors: ['#00ff9d', '#10b981'] },  // Neon Green
      { 
        radius: 440, 
        orbitSpeed: 0.022, 
        size: 20, 
        colors: ['#ffea00', '#f59e0b']
      },  // Gold
      { radius: 520, orbitSpeed: 0.021, size: 18, colors: ['#ff0055', '#ef4444'] },  // Neon Red
      { radius: 600, orbitSpeed: 0.02, size: 22, colors: ['#0099ff', '#1e40af'] },   // Electric Blue
    ];

    // Randomize start angles
    planets.forEach(p => {
      p.angle = Math.random() * Math.PI * 2;
      if (p.moon) {
        p.moon.angle = Math.random() * Math.PI * 2;
      }
    });

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw Sun
      ctx.save();
      ctx.translate(centerX, centerY);

      // Sun Glow
      const sunGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 70);
      sunGradient.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
      sunGradient.addColorStop(0.6, 'rgba(251, 191, 36, 0.2)');
      sunGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.fill();

      // Sun Core
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      planets.forEach(planet => {
        planet.angle += planet.orbitSpeed * 0.5;

        // Draw Orbit Line
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, planet.radius, planet.radius * 0.6, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Calculate Planet Position (Tilted)
        const x = centerX + Math.cos(planet.angle) * planet.radius;
        const y = centerY + Math.sin(planet.angle) * planet.radius * 0.6;

        // Draw Planet
        const planetGradient = ctx.createRadialGradient(x, y, 0, x, y, planet.size * 2);
        planetGradient.addColorStop(0, planet.colors[0]);
        planetGradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(x, y, planet.size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = planet.colors[1];
        ctx.beginPath();
        ctx.arc(x, y, planet.size, 0, Math.PI * 2);
        ctx.fill();

        // If planet has a moon, draw it
        if (planet.moon) {
          planet.moon.angle += planet.moon.orbitSpeed;
          
          const moonX = x + Math.cos(planet.moon.angle) * planet.moon.orbitRadius;
          const moonY = y + Math.sin(planet.moon.angle) * planet.moon.orbitRadius * 0.6; // Apply same tilt

          // Draw moon orbit
          ctx.beginPath();
          ctx.ellipse(x, y, planet.moon.orbitRadius, planet.moon.orbitRadius * 0.6, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
          
          // Draw moon
          ctx.fillStyle = planet.moon.color;
          ctx.beginPath();
          ctx.arc(moonX, moonY, planet.moon.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none bg-transparent"
    />
  );
};

export default SolarSystemBackground;