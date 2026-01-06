/*
 * Design Philosophy: Celestial Poetics
 * Component: Edit Pet Modal
 * - Allows users to edit pet information directly
 * - Photo upload and management
 * - Real-time validation
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Pet } from "@/types/pet";

interface EditPetModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPet: Pet) => void;
}

export default function EditPetModal({
  pet,
  isOpen,
  onClose,
  onSave,
}: EditPetModalProps) {
  const [formData, setFormData] = useState<Pet>(pet);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof Pet, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    // 유효성 검사
    if (!formData.name.trim()) {
      toast.error("반려동물 이름을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      // 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave(formData);
      toast.success("반려동물 정보가 저장되었습니다.");
      onClose();
    } catch (error) {
      toast.error("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur z-40"
          />

          {/* 모달 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border border-slate-700/50 shadow-2xl"
          >
            {/* 헤더 */}
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur">
              <h2 className="text-2xl font-light text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {pet.name} 정보 수정
              </h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 폼 */}
            <div className="p-6 space-y-6">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  이름
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-foreground"
                  placeholder="반려동물 이름"
                />
              </div>

              {/* 종류, 성별, 나이 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    종류
                  </label>
                  <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="강아지">강아지</SelectItem>
                      <SelectItem value="고양이">고양이</SelectItem>
                      <SelectItem value="토끼">토끼</SelectItem>
                      <SelectItem value="햄스터">햄스터</SelectItem>
                      <SelectItem value="새">새</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    성별
                  </label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="수컷">수컷</SelectItem>
                      <SelectItem value="암컷">암컷</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    나이 (세)
                  </label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange("age", parseInt(e.target.value) || 0)}
                    className="bg-slate-700/50 border-slate-600 text-foreground"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* 상태 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  상태
                </label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value as "함께하는 중" | "영원한 인연")}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="함께하는 중">함께하는 중</SelectItem>
                    <SelectItem value="영원한 인연">영원한 인연</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 프로필 이미지 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  대표 사진
                </label>
                <div className="relative">
                  {formData.profileImage && (
                    <img
                      src={formData.profileImage}
                      alt={formData.name}
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                  )}
                  <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-700/50 border border-dashed border-slate-600 hover:border-pink-500 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 text-pink-400" />
                    <span className="text-sm text-foreground">사진 변경</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            handleChange("profileImage", event.target?.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  설명 (선택사항)
                </label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-foreground resize-none"
                  placeholder="반려동물에 대한 설명을 입력해주세요..."
                  rows={4}
                />
              </div>
            </div>

            {/* 푸터 */}
            <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-slate-700/50 bg-slate-800/80 backdrop-blur">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-slate-600 hover:bg-slate-700/50"
              >
                취소
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isSaving ? "저장 중..." : "저장하기"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
