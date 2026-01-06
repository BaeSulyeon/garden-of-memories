import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ChevronLeft, ChevronRight, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import PhotoEditModal from "./PhotoEditModal";
import EditPetModal from "./EditPetModal";
import { Pet as PetType } from "@/types/pet";

interface Photo {
  id?: number;
  photoUrl: string;
  displayOrder: number;
}

interface Pet {
  id: number;
  name: string;
  type: string;
  gender: string;
  age: number;
  imageUrl: string;
  createdAt: Date;
  status?: "active" | "memorial";
}

interface PetCardProps {
  pet: Pet;
  photos?: Photo[];
  onPhotosUpdate?: (petId: number, photos: Photo[]) => void;
  onPetUpdate?: (updatedPet: Pet) => void;
}

export default function PetCard({ pet, photos = [], onPhotosUpdate, onPetUpdate }: PetCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);
  const [editPhotos, setEditPhotos] = useState<Photo[]>(photos);

  // 사진이 없으면 기본 이미지 사용
  const petImages = editPhotos.length > 0 
    ? editPhotos.map(p => p.photoUrl)
    : [pet.imageUrl, pet.imageUrl, pet.imageUrl];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? petImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === petImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePhotosChange = (newPhotos: Photo[]) => {
    setEditPhotos(newPhotos);
  };

  const handleSavePhotos = () => {
    if (onPhotosUpdate) {
      onPhotosUpdate(pet.id, editPhotos);
    }
    setIsEditModalOpen(false);
  };

  const isMemorial = pet.status === "memorial";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden bg-slate-800/50 border-slate-700/50 hover:border-pink-400/30 transition-all duration-300 backdrop-blur-sm">
          {/* 사진 슬라이드 */}
          <div className="relative aspect-square overflow-hidden bg-slate-900">
            <motion.img
              key={currentImageIndex}
              src={petImages[currentImageIndex]}
              alt={pet.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* 상태 배지 */}
            <div className="absolute top-3 right-3 z-10">
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isMemorial
                    ? "bg-purple-500/80 text-white"
                    : "bg-green-500/80 text-white"
                }`}
              >
                {isMemorial ? "영원한 인연" : "함께하는 중"}
              </div>
            </div>

            {/* 슬라이드 네비게이션 */}
            {petImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 rounded-full p-2 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 rounded-full p-2 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>

                {/* 슬라이드 인디케이터 */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                  {petImages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "w-4 bg-white"
                          : "w-1.5 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* 연결 상태 애니메이션 */}
            {!isMemorial && (
              <motion.div
                className="absolute top-3 left-3 z-10"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
              </motion.div>
            )}

            {/* 편집 버튼 */}
            <button
              onClick={() => setIsEditPetModalOpen(true)}
              className="absolute bottom-3 right-3 z-20 bg-pink-500/80 hover:bg-pink-600 rounded-full p-2 transition-colors"
              title="정보 편집"
            >
              <Edit2 className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* 정보 섹션 */}
          <div className="p-4 space-y-3">
            <div>
              <h3
                className="text-lg font-semibold text-foreground mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {pet.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {pet.type} • {pet.gender} • {pet.age}세
              </p>
            </div>

            {/* 기억들 버튼 */}
            <Button
              variant="outline"
              className="w-full border-pink-400/30 hover:border-pink-400 hover:bg-pink-400/10 text-sm"
              onClick={() => setIsEditModalOpen(true)}
            >
              기억들 보기
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* 사진 편집 모달 */}
      <PhotoEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditPhotos(photos);
        }}
        photos={editPhotos}
        onPhotosChange={handlePhotosChange}
        petName={pet.name}
      />

      {/* 반려동물 정보 편집 모달 */}
      <EditPetModal
        pet={pet as unknown as PetType}
        isOpen={isEditPetModalOpen}
        onClose={() => setIsEditPetModalOpen(false)}
        onSave={(updatedPet) => {
          if (onPetUpdate) {
            onPetUpdate(updatedPet as unknown as Pet);
          }
          setIsEditPetModalOpen(false);
        }}
      />
    </>
  );
}
