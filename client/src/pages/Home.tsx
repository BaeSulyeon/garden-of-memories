/*
 * Design Philosophy: Celestial Poetics
 * Page: Home (Garden of Memories)
 * - Immersive full-screen night sky
 * - Floating moons representing beloved pets
 * - Graceful interactions with modal reveals
 * - Meditative, poetic atmosphere
 */

import Moon from "@/components/Moon";
import NightSky from "@/components/NightSky";
import PetModal from "@/components/PetModal";
import { samplePets } from "@/data/pets";
import { Pet } from "@/types/pet";
import { useState } from "react";

export default function Home() {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleMoonClick = (pet: Pet) => {
    setSelectedPet(pet);
    setModalOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Night sky background with stars and shooting stars */}
      <NightSky />

      {/* Header */}
      <header className="relative z-10 pt-8 md:pt-12 pb-6 md:pb-8 text-center px-4">
        <h1
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-foreground mb-3 md:mb-4 animate-fade-in"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 300 }}
        >
          기억의 정원
        </h1>
        <p
          className="text-sm sm:text-base md:text-lg text-muted-foreground animate-fade-in"
          style={{
            fontFamily: "var(--font-body)",
            animationDelay: "0.3s",
            opacity: 0,
            animation: "fade-in 1s ease-out 0.3s forwards",
          }}
        >
          밤하늘에 빛나는 별들, 우리가 사랑했던 친구들
        </p>
      </header>

      {/* Moons (Pets) */}
      <div className="relative z-10 w-full h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] min-h-[500px] md:min-h-[600px]">
        {samplePets.map((pet) => (
          <Moon key={pet.id} pet={pet} onClick={() => handleMoonClick(pet)} />
        ))}
      </div>

      {/* Footer */}
      <footer className="relative z-10 pb-6 md:pb-8 text-center px-4">
        <p
          className="text-xs md:text-sm text-muted-foreground/70"
          style={{ fontFamily: "var(--font-body)" }}
        >
          각 별을 클릭하여 소중한 기억을 만나보세요
        </p>
      </footer>

      {/* Pet Modal */}
      <PetModal pet={selectedPet} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
