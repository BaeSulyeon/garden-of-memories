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
  }>({
    name: "",
    type: "",
    gender: "",
    age: "",
    imageUrl: "",
    status: "active",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      !formData.age ||
      !formData.imageUrl
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    onAddPet({
      name: formData.name,
      type: formData.type,
      gender: formData.gender,
      age: parseInt(formData.age),
      imageUrl: formData.imageUrl,
      status: formData.status,
    });

    // 폼 초기화
    setFormData({
      name: "",
      type: "",
      gender: "",
      age: "",
      imageUrl: "",
      status: "active",
    });
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
