/*
 * Design Philosophy: Celestial Poetics
 * Component: Moon (Individual celestial body)
 * - Image-based moon rendering with real moon pictures
 * - Breathing animation (subtle scale pulse)
 * - Soft glow effect with random twinkle
 * - Pet name centered below moon with fade-in
 * - Respectful hover interaction (gentle brightness increase)
 */

import { Pet } from "@/types/pet";
import { useEffect, useState } from "react";

interface MoonProps {
  pet: Pet;
  onClick: () => void;
}

export default function Moon({ pet, onClick }: MoonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showName, setShowName] = useState(false);

  // Show name after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowName(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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

  // Get text size classes
  const getTextSizeClass = () => {
    switch (pet.size) {
      case "large":
        return "text-lg md:text-xl";
      case "medium":
        return "text-base md:text-lg";
      case "small":
        return "text-sm md:text-base";
      default:
        return "text-base md:text-lg";
    }
  };

  // Random animation delay for variety
  const animationDelay = `${Math.random() * 2}s`;
  const twinkleDelay = `${Math.random() * 3}s`;

  return (
    <div
      className="absolute cursor-pointer transition-all duration-700 ease-out flex flex-col items-center"
      style={{
        left: `${pet.position?.x ?? 50}%`,
        top: `${pet.position?.y ?? 50}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Moon image */}
      <div
        className={`${getSizeClass()} animate-breathe animate-twinkle transition-all duration-500 rounded-full overflow-hidden`}
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
          className="w-full h-full object-cover animate-float"
          style={{
            animationDelay: twinkleDelay,
          }}
        />
      </div>

      {/* Pet name centered below moon */}
      <div
        className={`mt-3 md:mt-4 transition-opacity duration-1000 text-center ${
          showName ? "opacity-100" : "opacity-0"
        }`}
        style={{
          filter: "drop-shadow(0 0 4px rgba(0, 0, 0, 0.8))",
        }}
      >
        <p
          className={`${getTextSizeClass()} font-light text-foreground whitespace-nowrap`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          {pet.name}
        </p>
      </div>
    </div>
  );
}
