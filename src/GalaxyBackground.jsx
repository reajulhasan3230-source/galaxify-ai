import React, { useEffect, useRef } from 'react';

const GalaxyBackground = () => {
  const canvasRef = useRef(null);

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

    // Create star layers for parallax effect
    const stars = [];
    const starCount = 400;
    const shootingStars = [];

    // Initialize stars with depth (z-axis for parallax)
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random(), // 0 = far, 1 = close
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Create shooting star occasionally
    const createShootingStar = () => {
      if (Math.random() > 0.98 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          length: Math.random() * 80 + 40,
          speed: Math.random() * 4 + 3,
          angle: Math.random() * Math.PI / 4 + Math.PI / 6, // 30-75 degrees
          opacity: 1,
        });
      }
    };

    let time = 0;
    let animationFrameId;

    const animate = () => {
      time += 0.016; // ~60fps

      // Draw background with gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0, '#0a0520');
      gradient.addColorStop(0.5, '#050315');
      gradient.addColorStop(1, '#030213');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebula clouds (subtle color variations)
      ctx.globalCompositeOperation = 'screen';
      
      // Purple nebula
      const nebula1 = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.4,
        0,
        canvas.width * 0.3,
        canvas.height * 0.4,
        canvas.width * 0.4
      );
      nebula1.addColorStop(0, 'rgba(139, 92, 246, 0.03)');
      nebula1.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Blue nebula
      const nebula2 = ctx.createRadialGradient(
        canvas.width * 0.7,
        canvas.height * 0.6,
        0,
        canvas.width * 0.7,
        canvas.height * 0.6,
        canvas.width * 0.5
      );
      nebula2.addColorStop(0, 'rgba(59, 130, 246, 0.02)');
      nebula2.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'source-over';

      // Draw stars with parallax
      stars.forEach((star) => {
        // Parallax movement (closer stars move faster)
        star.y += star.z * 0.3;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        // Twinkle effect
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
        const alpha = star.opacity * twinkle;

        // Size based on depth
        const depth = star.z * 0.8 + 0.2;
        const size = star.size * depth;

        // Color based on depth (closer = more blue/white, farther = dimmer)
        const colorIntensity = Math.floor(150 + depth * 105);
        const blueShift = Math.floor(200 + depth * 55);

        // Draw star with glow
        const glowSize = size * 3;
        const gradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          glowSize
        );
        
        gradient.addColorStop(0, `rgba(${colorIntensity}, ${colorIntensity + 20}, ${blueShift}, ${alpha})`);
        gradient.addColorStop(0.3, `rgba(${colorIntensity}, ${colorIntensity + 20}, ${blueShift}, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${colorIntensity}, ${colorIntensity + 20}, ${blueShift}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw bright core
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw shooting stars
      shootingStars.forEach((shootingStar, index) => {
        const dx = Math.cos(shootingStar.angle) * shootingStar.speed;
        const dy = Math.sin(shootingStar.angle) * shootingStar.speed;

        shootingStar.x += dx;
        shootingStar.y += dy;
        shootingStar.opacity -= 0.01;

        if (shootingStar.opacity <= 0 || shootingStar.x > canvas.width || shootingStar.y > canvas.height) {
          shootingStars.splice(index, 1);
          return;
        }

        // Draw shooting star trail
        const trailGradient = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
          shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
        );
        trailGradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity * 0.8})`);
        trailGradient.addColorStop(0.3, `rgba(150, 200, 255, ${shootingStar.opacity * 0.4})`);
        trailGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');

        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
          shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
        );
        ctx.stroke();

        // Draw bright head
        const headGradient = ctx.createRadialGradient(
          shootingStar.x,
          shootingStar.y,
          0,
          shootingStar.x,
          shootingStar.y,
          4
        );
        headGradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        headGradient.addColorStop(1, `rgba(150, 200, 255, ${shootingStar.opacity * 0.3})`);
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(shootingStar.x, shootingStar.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Occasionally create shooting stars
      createShootingStar();

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
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default GalaxyBackground;