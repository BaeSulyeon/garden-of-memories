/*
 * Design Philosophy: Celestial Poetics
 * Component: Moon (Individual celestial body)
 * - Breathing animation (subtle scale pulse)
 * - Soft glow effect with random twinkle
 * - Curved text below showing pet name with fade-in
 * - Respectful hover interaction (gentle brightness increase)
 */

import { Pet } from "@/types/pet";
import { useEffect, useRef, useState } from "react";

interface MoonProps {
  pet: Pet;
  onClick: () => void;
}

export default function Moon({ pet, onClick }: MoonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showName, setShowName] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Show name after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowName(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Draw curved text on canvas
  useEffect(() => {
    if (!showName) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size based on moon size
    const canvasSize = pet.size === "large" ? 200 : pet.size === "medium" ? 160 : 120;
    canvas.width = canvasSize;
    canvas.height = canvasSize / 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.font = `${pet.size === "large" ? 18 : pet.size === "medium" ? 16 : 14}px 'Noto Sans KR', sans-serif`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw curved text
    const text = pet.name;
    const radius = canvasSize / 3;
    const angleStep = 0.3 / text.length;
    const startAngle = Math.PI / 2 - (angleStep * text.length) / 2;

    ctx.save();
    ctx.translate(canvas.width / 2, 10);

    for (let i = 0; i < text.length; i++) {
      const angle = startAngle + angleStep * i;
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, radius);
      ctx.rotate(-angle);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    ctx.restore();
  }, [pet.name, pet.size, showName]);

  // Get moon image based on type
  const getMoonImage = () => {
    switch (pet.moonType) {
      case "full":
        return "/images/moon-1.png";
      case "crescent":
        return "/images/moon-2.png";
      case "gibbous":
        return "/images/moon-3.png";
      default:
        return "/images/moon-1.png";
    }
  };

  // Get size classes (responsive)
  const getSizeClass = () => {
    switch (pet.size) {
      case "large":
        return "w-24 h-24 md:w-32 md:h-32";
      case "medium":
        return "w-20 h-20 md:w-24 md:h-24";
      case "small":
        return "w-12 h-12 md:w-16 md:h-16";
      default:
        return "w-20 h-20 md:w-24 md:h-24";
    }
  };

  // Random animation delay for variety
  const animationDelay = `${Math.random() * 2}s`;
  const twinkleDelay = `${Math.random() * 3}s`;

  return (
    <div
      className="absolute cursor-pointer transition-all duration-700 ease-out"
      style={{
        left: `${pet.position.x}%`,
        top: `${pet.position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex flex-col items-center">
        {/* Moon image */}
        <div
          className={`${getSizeClass()} animate-breathe animate-twinkle transition-all duration-500`}
          style={{
            animationDelay: animationDelay,
            filter: isHovered
              ? "drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) brightness(1.2)"
              : "drop-shadow(0 0 12px rgba(255, 255, 255, 0.5))",
          }}
        >
          <img
            src={getMoonImage()}
            alt={pet.name}
            className="w-full h-full object-contain animate-float"
            style={{
              animationDelay: twinkleDelay,
            }}
          />
        </div>

        {/* Curved text name */}
        <canvas
          ref={canvasRef}
          className={`mt-2 transition-opacity duration-1000 ${
            showName ? "opacity-100" : "opacity-0"
          }`}
          style={{
            filter: "drop-shadow(0 0 4px rgba(0, 0, 0, 0.8))",
          }}
        />
      </div>
    </div>
  );
}
