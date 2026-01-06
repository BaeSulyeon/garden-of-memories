/*
 * Design Philosophy: Celestial Poetics
 * Page: Home (Garden of Memories)
 * - Immersive full-screen night sky
 * - Floating moons representing beloved pets
 * - Graceful interactions with modal reveals
 * - Meditative, poetic atmosphere
 * - Real-time reply notifications via WebSocket
 */

import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import Moon from "@/components/Moon";
import NightSky from "@/components/NightSky";
import PetModal from "@/components/PetModal";
import ReplyNotification from "@/components/ReplyNotification";
import ReplyModal from "@/components/ReplyModal";
import GardenNavigation from "@/components/GardenNavigation";
import { useReplyNotification } from "@/hooks/useReplyNotification";
import { samplePets } from "@/data/pets";
import { Pet } from "@/types/pet";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { notification, dismissNotification, registerUser } =
    useReplyNotification();

  // 홈 화면 새로고침 함수 (전역 상태 업데이트)
  const refreshHome = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // 전역 이벤트 리스너 등록
  useEffect(() => {
    const handlePetAdded = () => {
      refreshHome();
    };
    window.addEventListener("petAdded", handlePetAdded);
    return () => window.removeEventListener("petAdded", handlePetAdded);
  }, [refreshHome]);

  // 사용자 등록 (실제로는 인증 시스템에서 가져와야 함)
  useEffect(() => {
    registerUser(1); // 테스트용 사용자 ID
  }, [registerUser]);

  const handleMoonClick = (pet: Pet) => {
    setLocation(`/pet/${pet.id}`);
  };

  const handleOpenReply = () => {
    setReplyModalOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Navigation */}
      <GardenNavigation />

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

      {/* Add Moon Button */}
      <div className="relative z-10 flex justify-center pb-4 md:pb-6 px-4">
        <button
          onClick={() => setLocation("/my-garden?modal=add-pet")}
          className="px-6 md:px-8 py-2 md:py-3 border border-foreground/80 hover:border-foreground text-foreground hover:text-foreground/90 transition-all duration-300 rounded-lg text-sm md:text-base"
          style={{
            fontFamily: "var(--font-body)",
            backgroundColor: "transparent",
            backdropFilter: "blur(4px)",
          }}
        >
          나의 달 띄우기
        </button>
      </div>

      {/* Moons (Pets) */}
      <div key={refreshKey} className="relative z-10 w-full h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] min-h-[500px] md:min-h-[600px]">
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

      {/* Real-time Reply Notification */}
      {notification && (
        <ReplyNotification
          petName={notification.petName}
          onDismiss={dismissNotification}
          onOpen={handleOpenReply}
        />
      )}

      {/* Reply Modal */}
      {notification && (
        <ReplyModal
          petName={notification.petName}
          replyContent={notification.replyContent}
          emotionalTone={notification.emotionalTone}
          open={replyModalOpen}
          onOpenChange={setReplyModalOpen}
        />
      )}
    </div>
  );
}
