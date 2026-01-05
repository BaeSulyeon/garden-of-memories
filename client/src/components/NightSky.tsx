/*
 * Design Philosophy: Celestial Poetics
 * Component: NightSky Background
 * - Deep gradient from indigo to black-violet
 * - Random shooting stars every 3-7 seconds
 * - Small twinkling stars scattered across the sky
 */

import { useEffect, useRef, useState } from "react";

interface ShootingStar {
  id: number;
  left: string;
  top: string;
  delay: number;
}

export default function NightSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const nextIdRef = useRef(0);

  // Canvas-based twinkling stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Generate random stars
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      opacity: number;
      twinkleSpeed: number;
      twinklePhase: number;
    }> = [];

    const starCount = window.innerWidth < 768 ? 80 : 150;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const currentOpacity =
          star.opacity + Math.sin(star.twinklePhase) * 0.3;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();

        // Add subtle glow
        const gradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.radius * 3
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.3})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Shooting stars with state management
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    const createShootingStar = () => {
      const newStar: ShootingStar = {
        id: nextIdRef.current++,
        left: `${Math.random() * 60 + 20}%`,
        top: `${Math.random() * 40}%`,
        delay: 0,
      };
      setShootingStars((prev: ShootingStar[]) => [...prev, newStar]);

      // Remove after animation completes
      setTimeout(() => {
        setShootingStars((prev: ShootingStar[]) => prev.filter((star: ShootingStar) => star.id !== newStar.id));
      }, 1500);
    };

    // Create shooting stars at random intervals (3-7 seconds)
    const scheduleNext = () => {
      const delay = Math.random() * 4000 + 3000;
      setTimeout(() => {
        createShootingStar();
        scheduleNext();
      }, delay);
    };

    scheduleNext();
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top, oklch(0.18 0.08 280) 0%, oklch(0.12 0.04 280) 50%, oklch(0.08 0.02 270) 100%)",
        }}
      />

      {/* Canvas for twinkling stars */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-80"
        style={{ pointerEvents: "none" }}
      />

      {/* Shooting stars */}
      {shootingStars.map((star: ShootingStar) => (
        <div
          key={star.id}
          className="absolute animate-shooting-star"
          style={{
            left: star.left,
            top: star.top,
          }}
        >
          <img
            src="/images/shooting-star.png"
            alt=""
            className="w-32 h-auto opacity-90"
            style={{
              filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))",
            }}
          />
        </div>
      ))}
    </div>
  );
}
