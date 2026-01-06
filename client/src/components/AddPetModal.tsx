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
import { Upload, X } from "lucide-react";
import { MOON_DESIGNS } from "@/utils/moonDesignsImages";
import { Textarea } from "@/components/ui/textarea";

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
    memories?: string[];
    userLetter?: string;
    aiLetter?: string;
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

const GENDERS = ["수컷", "암컷"];
const STATUSES = ["함께하는 중", "영원한 인연"];

export default function AddPetModal({
  open,
  onOpenChange,
  onAddPet,
}: AddPetModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState("함께하는 중");
  const [moonDesign, setMoonDesign] = useState("moon-1");
  const [memories, setMemories] = useState<string[]>([]);
  const [userLetter, setUserLetter] = useState("");
  const [aiLetter, setAiLetter] = useState("");

  const handleMemoryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setMemories((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const removeMemory = (index: number) => {
    setMemories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPet = () => {
    if (!name || !type || !gender || !age) {
      alert("모든 필드를 입력해주세요");
      return;
    }

    onAddPet({
      name,
      type,
      gender,
      age: parseInt(age),
      imageUrl: "",
      status: status === "함께하는 중" ? "active" : "memorial",
      moonDesign,
      memories: memories.length > 0 ? memories : undefined,
      userLetter: userLetter || undefined,
      aiLetter: aiLetter || undefined,
    });

    // 초기화
    setStep(1);
    setName("");
    setType("");
    setGender("");
    setAge("");
    setStatus("함께하는 중");
    setMoonDesign("moon-1");
    setMemories([]);
    setUserLetter("");
    setAiLetter("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setStep(1);
    setName("");
    setType("");
    setGender("");
    setAge("");
    setStatus("함께하는 중");
    setMoonDesign("moon-1");
    setMemories([]);
    setUserLetter("");
    setAiLetter("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새로운 친구 추가</DialogTitle>
          <DialogDescription>
            Step {step} of 3 - {step === 1 ? "기본 정보" : step === 2 ? "기억들" : "편지"}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: 기본 정보 */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="반려동물의 이름을 입력해주세요"
              />
            </div>

            <div>
              <Label htmlFor="type">종류</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="종류를 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {PET_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gender">성별</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="성별을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="age">나이</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="나이를 입력해주세요"
              />
            </div>

            <div>
              <Label htmlFor="status">상태</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="상태를 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>달 디자인 선택</Label>
              <div className="grid grid-cols-4 gap-4 mt-2">
                {MOON_DESIGNS.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => setMoonDesign(design.id)}
                    className={`relative p-2 rounded-lg border-2 transition ${
                      moonDesign === design.id
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={design.imagePath}
                      alt={design.name}
                      className="w-full h-20 object-cover rounded"
                    />
                    <p className="text-xs mt-1 text-center text-gray-600">
                      {design.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: 기억들 */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>기억 사진 업로드</Label>
              <p className="text-sm text-gray-500 mb-2">
                반려동물과의 소중한 순간들을 사진으로 남겨보세요
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto mb-2 text-gray-400" />
                <label className="cursor-pointer">
                  <span className="text-sm text-blue-500 hover:text-blue-600">
                    사진 선택
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMemoryUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {memories.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">
                    업로드된 사진 ({memories.length}장)
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {memories.map((memory, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={memory}
                          alt={`Memory ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          onClick={() => removeMemory(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: 편지 */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="userLetter">사용자 편지</Label>
              <p className="text-sm text-gray-500 mb-2">
                반려동물에게 전하고 싶은 말을 적어보세요
              </p>
              <Textarea
                id="userLetter"
                value={userLetter}
                onChange={(e) => setUserLetter(e.target.value)}
                placeholder="반려동물에게 전하고 싶은 말을 입력해주세요..."
                className="min-h-32"
              />
            </div>

            <div>
              <Label htmlFor="aiLetter">AI 답장 편지</Label>
              <p className="text-sm text-gray-500 mb-2">
                반려동물이 보내는 답장 편지를 입력해보세요
              </p>
              <Textarea
                id="aiLetter"
                value={aiLetter}
                onChange={(e) => setAiLetter(e.target.value)}
                placeholder="반려동물의 답장을 입력해주세요..."
                className="min-h-32"
              />
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex justify-between gap-2 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            취소
          </Button>
          <div className="flex gap-2">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                이전
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>
                다음으로
              </Button>
            ) : (
              <Button onClick={handleAddPet} className="bg-pink-500 hover:bg-pink-600">
                추가하기
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
