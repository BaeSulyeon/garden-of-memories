/*
 * Design Philosophy: Celestial Poetics
 * Page: Home (Garden of Memories)
 * - Immersive full-screen night sky
 * - Floating moons representing beloved pets
 * - Graceful interactions with modal reveals
 * - Meditative, poetic atmosphere
 * - Real-time reply notifications via WebSocket
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Moon from "@/components/Moon";
import NightSky from "@/components/NightSky";
import PetModal from "@/components/PetModal";
import AddPetModal from "@/components/AddPetModal";
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
  const [addPetModalOpen, setAddPetModalOpen] = useState(false);
  const [pets, setPets] = useState<Pet[]>(samplePets); // 샘플 데이터로 초기화
  const [loading, setLoading] = useState(true);
  const { notification, dismissNotification, registerUser } =
    useReplyNotification();

  // 사용자 등록 (실제로는 인증 시스템에서 가져와야 함)
  useEffect(() => {
    registerUser(1); // 테스트용 사용자 ID
  }, [registerUser]);

  // 데이터베이스에서 반려동물 조회
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("/api/pets");
        if (response.ok) {
          const data = await response.json();
          // 데이터베이스의 반려동물과 샘플 반려동물 합치기
          const dbPets = data.map((pet: any) => ({
            id: pet.id,
            name: pet.name,
            type: pet.type,
            gender: pet.gender,
            age: pet.age,
            imageUrl: pet.imageUrl || "/default-pet.png",
            status: pet.status || "active",
            moonDesign: pet.moonDesign || "blue",
          }));
          // 샘플 데이터와 데이터베이스 데이터 합치기
          setPets([...samplePets, ...dbPets]);
        }
      } catch (error) {
        console.error("Failed to fetch pets:", error);
        // 에러 발생 시 샘플 데이터만 사용
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleMoonClick = (pet: Pet) => {
    setLocation(`/pet/${pet.id}`);
  };

  const handleOpenReply = () => {
    setReplyModalOpen(true);
  };

  const handleAddPet = (pet: any) => {
    // 반려동물 추가 후 모달 닫기
    setAddPetModalOpen(false);
    // 나의 정원으로 이동
    setLocation("/my-garden");
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

      {/* 나의 달 띄우기 버튼 */}
      <div className="relative z-10 flex justify-center mb-4">
        <button
          onClick={() => setAddPetModalOpen(true)}
          className="px-6 py-2 border border-white rounded-lg text-white hover:bg-white/10 transition-all duration-300 font-medium"
        >
          나의 달 띄우기
        </button>
      </div>

      {/* Moons (Pets) */}
      <div className="relative z-10 w-full h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] min-h-[500px] md:min-h-[600px]">
        {!loading && pets.map((pet) => (
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

      {/* Add Pet Modal */}
      <AddPetModal
        open={addPetModalOpen}
        onOpenChange={setAddPetModalOpen}
        onAddPet={handleAddPet}
      />

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
