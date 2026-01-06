/*
 * Design Philosophy: Celestial Poetics
 * Page: My Garden (사용자 반려동물 관리)
 * - Personal pet collection management
 * - Add new pets with detailed information
 * - Photo gallery with carousel
 * - Connection status visualization
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Heart } from "lucide-react";
import AddPetModal from "@/components/AddPetModal";
import PetCard from "@/components/PetCard";
import CosmicBackButton from "@/components/CosmicBackButton";
import { trpc } from "@/lib/trpc";
import { usePetContext } from "@/contexts/PetContext";
import { Link } from "wouter";
import { toast } from "sonner";

interface UserPet {
  id: number;
  name: string;
  type: string;
  gender: string;
  age: number;
  imageUrl: string;
  createdAt: Date;
  status?: "active" | "memorial";
  moonDesign?: string; // moon-1 ~ moon-8
}

export default function MyGarden() {
  const { updatePet: updatePetInContext } = usePetContext();
  const [pets, setPets] = useState<UserPet[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 반려동물 목록 조회 (실제로는 tRPC 쿼리 사용)
  useEffect(() => {
    // 샘플 데이터로 시작
    const samplePets: UserPet[] = [
      {
        id: 1,
        name: "뽀삐",
        type: "강아지",
        gender: "수컷",
        age: 5,
        imageUrl: "/images/moon-1.png",
        createdAt: new Date("2024-01-15"),
        status: "memorial",
      },
      {
        id: 2,
        name: "나비",
        type: "고양이",
        gender: "암컷",
        age: 3,
        imageUrl: "/images/moon-2.png",
        createdAt: new Date("2024-02-20"),
        status: "active",
      },
    ];

    setPets(samplePets);
    setIsLoading(false);
  }, []);

  const handleAddPet = async (newPet: Omit<UserPet, "id" | "createdAt"> & { status: "active" | "memorial"; moonDesign: string; userLetter?: string }) => {
    const pet: UserPet = {
      ...newPet,
      id: pets.length + 1,
      createdAt: new Date(),
    };
    setPets([...pets, pet]);
    setIsAddModalOpen(false);

    // 편지를 서버에 제출하여 AI 답장 생성
    if (newPet.userLetter) {
      try {
        const response = await fetch("/api/letters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: 1,
            petId: pet.id,
            petName: pet.name,
            content: newPet.userLetter,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit letter");
        }

        const data = await response.json();
        console.log("Letter submitted:", data);
      } catch (error) {
        console.error("Error submitting letter:", error);
      }
    }

    // AI 답장 알림 팝업 - 2초 후 표시
    setTimeout(() => {
      toast(
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">
            💌 <span className="font-bold text-pink-400">{pet.name}</span>로부터 답장이 도착했습니다!
          </p>
          <Button
            onClick={() => {
              toast.dismiss();
              window.location.href = `/pet/${pet.id}`;
            }}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white text-sm"
          >
            답장보기
          </Button>
        </div>,
        {
          duration: 10000,
          position: "top-center",
        }
      );
    }, 2000);
  };

  const handlePetUpdate = (updatedPet: UserPet) => {
    setPets((prevPets) =>
      prevPets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet))
    );
    // Context에도 업데이트 (메인 페이지 동기화용)
    updatePetInContext(updatedPet.id, updatedPet as any);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10">
        {/* 뒤로가기 버튼 */}
        <div className="pt-6 px-4 md:px-8 flex justify-start">
          <CosmicBackButton />
        </div>

        {/* 헤더 */}
        <header className="pt-8 md:pt-12 pb-8 md:pb-12 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 md:w-10 md:h-10 text-pink-400 fill-pink-400" />
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 300 }}
            >
              나의 정원
            </h1>
            <Heart className="w-8 h-8 md:w-10 md:h-10 text-pink-400 fill-pink-400" />
          </div>
          <p
            className="text-sm sm:text-base md:text-lg text-muted-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
            소중한 친구들의 기억을 간직하는 나만의 공간
          </p>
        </header>

        {/* 반려동물 목록 */}
        <div className="px-4 md:px-8 pb-16">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          ) : pets.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-6">
                아직 등록된 반려동물이 없습니다.
              </p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                첫 친구 추가하기
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                {pets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onPetUpdate={handlePetUpdate}
                  />
                ))}
              </div>

              {/* 추가 버튼 */}
              <div className="flex justify-center">
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  variant="outline"
                  className="border-pink-400/50 hover:border-pink-400 hover:bg-pink-400/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  새로운 친구 추가
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 반려동물 추가 모달 */}
      <AddPetModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddPet={handleAddPet}
      />
    </div>
  );
}
