import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { MOON_DESIGNS } from "@/utils/moonDesignsImages";

interface AddPetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPet: (pet: {
    name: string;
    type: string;
    gender: string;
    age: number;
    imageUrl: string;
    status: "함께하는 중" | "영원한 인연";
    moonDesign: string;
    userLetter?: string;
  }) => void;
}

const PET_TYPES = [
  "강아지",
  "고양이",
  "토끼",
  "햄스터",
  "새",
  "물고기",
  "파충류",
  "기타",
];

export default function AddPetModal({
  open,
  onOpenChange,
  onAddPet,
}: AddPetModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    name: string;
    type: string;
    gender: string;
    age: string;
    imageUrl: string;
    status: "함께하는 중" | "영원한 인연";
    moonDesign: string;
    userLetter: string;
  }>({
    name: "",
    type: "",
    gender: "",
    age: "",
    imageUrl: "",
    status: "함께하는 중",
    moonDesign: "moon-1",
    userLetter: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedMoonIndex, setSelectedMoonIndex] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    // Step 1 검증
    if (step === 1) {
      if (
        !formData.name ||
        !formData.type ||
        !formData.gender ||
        !formData.age
      ) {
        alert("모든 필드를 입력해주세요.");
        return;
      }
    }

    // Step 2 검증 (사진 업로드는 선택사항)
    // if (step === 2) {
    //   if (!formData.imageUrl) {
    //     alert("대표 사진을 업로드해주세요.");
    //     return;
    //   }
    // }

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userLetter.trim()) {
      alert("편지를 작성해주세요.");
      return;
    }

    try {
      // 1. 반려동물 저장
      const petResponse = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1, // 테스트용 사용자 ID
          name: formData.name,
          type: formData.type,
          gender: formData.gender,
          age: parseInt(formData.age),
          status: formData.status || "함께하는 중",
          moonDesign: formData.moonDesign,
          profileImage: formData.imageUrl,
        }),
      });

      if (!petResponse.ok) {
        throw new Error("Failed to save pet");
      }

      const petData = await petResponse.json();
      const petId = petData.id;

      // 2. 편지 저장 (반려동물 ID와 함께)
      const letterResponse = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1, // 테스트용 사용자 ID
          petId: petId || 0,
          petName: formData.name,
          content: formData.userLetter,
        }),
      });

      if (!letterResponse.ok) {
        throw new Error("Failed to save letter");
      }

      // 3. 콜백 호출
      onAddPet({
        name: formData.name,
        type: formData.type,
        gender: formData.gender,
        age: parseInt(formData.age),
        imageUrl: formData.imageUrl,
        status: formData.status,
        moonDesign: formData.moonDesign,
        userLetter: formData.userLetter,
      });

      // 폼 초기화
      setFormData({
        name: "",
        type: "",
        gender: "",
        age: "",
        imageUrl: "",
        status: "함께하는 중",
        moonDesign: "moon-1",
        userLetter: "",
      });
      setImagePreview(null);
      setStep(1);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting letter:", error);
      alert("편지 제출 중 오류가 발생했습니다.");
      return;
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      type: "",
      gender: "",
      age: "",
      imageUrl: "",
      status: "함께하는 중",
      moonDesign: "moon-1",
      userLetter: "",
    });
    setImagePreview(null);
    setStep(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle
            style={{ fontFamily: "var(--font-heading)", fontWeight: 300 }}
          >
            나의 달 띄우기
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "소중한 반려동물의 기본 정보를 입력해주세요."}
            {step === 2 && "반려동물의 대표 사진을 업로드해주세요."}
            {step === 3 && "반려동물에게 편지를 써주세요."}
          </DialogDescription>
        </DialogHeader>

        {/* 진행 상황 표시 */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`flex-1 h-2 rounded-full transition-colors ${
              step >= 1 ? "bg-pink-400" : "bg-gray-300"
            }`}
          />
          <div
            className={`flex-1 h-2 rounded-full transition-colors ${
              step >= 2 ? "bg-pink-400" : "bg-gray-300"
            }`}
          />
          <div
            className={`flex-1 h-2 rounded-full transition-colors ${
              step >= 3 ? "bg-pink-400" : "bg-gray-300"
            }`}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: 기본 정보 */}
          {step === 1 && (
            <div className="space-y-4">
              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  placeholder="예: 뽀삐"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              {/* 종류 */}
              <div className="space-y-2">
                <Label htmlFor="type">종류</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="종류 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {PET_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 성별 */}
              <div className="space-y-2">
                <Label htmlFor="gender">성별</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="성별 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="수컷">수컷</SelectItem>
                    <SelectItem value="암컷">암컷</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 나이 */}
              <div className="space-y-2">
                <Label htmlFor="age">나이 (세)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="예: 5"
                  min="0"
                  max="30"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, age: e.target.value }))
                  }
                />
              </div>

              {/* 상태 */}
              <div className="space-y-2">
                <Label htmlFor="status">상태</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value as "함께하는 중" | "영원한 인연",
                    }))
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="함께하는 중">함께하는 중</SelectItem>
                    <SelectItem value="영원한 인연">영원한 인연</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: 사진 업로드 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">대표 사진</Label>
                <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 rounded-lg mx-auto object-cover"
                      />
                      <p className="text-sm text-muted-foreground">
                        클릭하여 변경
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        사진을 클릭하여 업로드
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 달 디자인 선택 */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">달 디자인 선택</Label>
                <div className="grid grid-cols-4 gap-3">
                  {MOON_DESIGNS.map((design, index) => (
                    <button
                      key={design.id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          moonDesign: design.id,
                        }));
                        setSelectedMoonIndex(index);
                      }}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                        formData.moonDesign === design.id
                          ? "border-pink-400 ring-2 ring-pink-300"
                          : "border-gray-300 hover:border-pink-200"
                      }`}
                    >
                      <img
                        src={design.imagePath}
                        alt={design.name}
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                      <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 text-center">
                        {design.name}
                      </p>
                    </button>
                  ))}
                </div>

                {/* 선택된 달 미리보기 */}
                <div className="flex justify-center mt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">선택된 달</p>
                    <img
                      src={MOON_DESIGNS[selectedMoonIndex].imagePath}
                      alt="Selected moon"
                      className="w-32 h-32 rounded-full object-cover shadow-lg"
                    />
                    <p className="mt-2 text-sm font-medium">
                      {MOON_DESIGNS[selectedMoonIndex].name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: 편지 작성 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="letter">
                  {formData.name}에게 보내는 편지
                </Label>
                <textarea
                  id="letter"
                  placeholder="소중한 친구에게 전하고 싶은 말을 써주세요..."
                  value={formData.userLetter}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userLetter: e.target.value,
                    }))
                  }
                  className="w-full h-48 p-3 border border-muted-foreground/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.userLetter.length}자
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💌 편지를 제출하면 {formData.name}로부터 따뜻한 답장이 도착할
                  예정입니다.
                </p>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                이전
              </Button>
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
              >
                다음
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
                >
                  편지 제출
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
