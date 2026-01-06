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
import { Upload } from "lucide-react";
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
    status: "active" | "memorial";
    moonDesign: string;
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
  const [formData, setFormData] = useState<{
    name: string;
    type: string;
    gender: string;
    age: string;
    imageUrl: string;
    status: "active" | "memorial";
    moonDesign: string;
  }>({
    name: "",
    type: "",
    gender: "",
    age: "",
    imageUrl: "",
    status: "active",
    moonDesign: "moon-1",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.type ||
      !formData.gender ||
      !formData.age
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    onAddPet({
      name: formData.name,
      type: formData.type,
      gender: formData.gender,
      age: parseInt(formData.age),
      imageUrl: formData.imageUrl || "/images/default-pet.png",
      status: formData.status,
      moonDesign: formData.moonDesign,
    });

    // 폼 초기화
    setFormData({
      name: "",
      type: "",
      gender: "",
      age: "",
      imageUrl: "",
      status: "active",
      moonDesign: "full-bright",
    });
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle
            style={{ fontFamily: "var(--font-heading)", fontWeight: 300 }}
          >
            새로운 친구 추가
          </DialogTitle>
          <DialogDescription>
            소중한 반려동물의 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 사진 업로드 */}
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
                    className="w-24 h-24 rounded-lg mx-auto object-cover"
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
                  status: (value === "active" || value === "memorial" ? value : "active") as "active" | "memorial",
                }))
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">함께하는 중</SelectItem>
                <SelectItem value="memorial">영원한 인연</SelectItem>
              </SelectContent>
            </Select>
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
                    setFormData((prev) => ({ ...prev, moonDesign: design.id }));
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
                <p className="mt-2 text-sm font-medium">{MOON_DESIGNS[selectedMoonIndex].name}</p>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500"
            >
              추가하기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
