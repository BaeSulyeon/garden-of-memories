import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Pet } from "@/types/pet";

interface PetProfileModalProps {
  pet: Pet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PetProfileModal({
  pet,
  open,
  onOpenChange,
}: PetProfileModalProps) {
  if (!pet) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pet.name}의 프로필</DialogTitle>
          <DialogDescription>
            소중한 반려동물의 기억과 편지를 확인해보세요
          </DialogDescription>
        </DialogHeader>

        {/* 기본 정보 */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">이름</p>
              <p className="font-semibold">{pet.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">종류</p>
              <p className="font-semibold">{pet.species || pet.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">성별</p>
              <p className="font-semibold">{pet.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">나이</p>
              <p className="font-semibold">{pet.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">상태</p>
              <p className="font-semibold">{pet.status}</p>
            </div>
            {pet.dateOfPassing && (
              <div>
                <p className="text-sm text-gray-500">별이 된 날</p>
                <p className="font-semibold">{pet.dateOfPassing}</p>
              </div>
            )}
          </div>

          {pet.story && (
            <div>
              <p className="text-sm text-gray-500 mb-1">이야기</p>
              <p className="text-sm">{pet.story}</p>
            </div>
          )}
        </div>

        {/* 기억 갤러리 */}
        {pet.memories && pet.memories.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold text-lg">기억들</h3>
            <div className="grid grid-cols-4 gap-2">
              {pet.memories.map((memory, index) => (
                <div key={index} className="relative group">
                  <img
                    src={memory}
                    alt={`Memory ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 사용자 편지 */}
        {pet.userLetter && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold text-lg">나의 편지</h3>
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <p className="text-sm whitespace-pre-wrap">{pet.userLetter}</p>
            </div>
          </div>
        )}

        {/* AI 답장 편지 */}
        {pet.aiLetter && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold text-lg">{pet.name}의 답장</h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm whitespace-pre-wrap">{pet.aiLetter}</p>
            </div>
          </div>
        )}

        {/* 닫기 버튼 */}
        <div className="flex justify-end gap-2 mt-6 border-t pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
