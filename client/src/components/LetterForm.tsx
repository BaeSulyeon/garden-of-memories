import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Pet } from "@/types/pet";
import { Send, Loader2 } from "lucide-react";
import LetterSendingAnimation from "./LetterSendingAnimation";

interface LetterFormProps {
  pet: Pet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (content: string) => Promise<void>;
}

export default function LetterForm({ pet, open, onOpenChange, onSubmit }: LetterFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setCharCount(text.length);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    setShowAnimation(true);
    try {
      await onSubmit(content);
      // 애니메이션 완료 후 모달 닫기
      setTimeout(() => {
        setContent("");
        setCharCount(0);
        setShowAnimation(false);
        onOpenChange(false);
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <LetterSendingAnimation isVisible={showAnimation} petName={pet.name} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {pet.name}에게 편지 쓰기
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {pet.name}에게 하고 싶은 말씀을 자유롭게 적어주세요.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* 반려동물 정보 미니 카드 */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-lg">
              🐾
            </div>
            <div>
              <p className="font-semibold">{pet.name}</p>
              <p className="text-xs text-muted-foreground">{pet.species} · {pet.age}살</p>
            </div>
          </div>

          {/* 편지 작성 영역 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">편지 내용</label>
            <Textarea
              placeholder={`${pet.name}에게 전하고 싶은 말씀을 적어주세요...\n\n그리움, 감사함, 미안함, 추억 등 어떤 감정이든 괜찮습니다.`}
              value={content}
              onChange={handleContentChange}
              className="min-h-64 resize-none"
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>자유롭게 마음을 표현해주세요</span>
              <span>{charCount} 글자</span>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              ✨ <strong>당신의 편지는 특별합니다.</strong> {pet.name}이 12-24시간 후에 따뜻한 답장을 보내줄 거예요.
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  전송 중...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  편지 보내기
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
