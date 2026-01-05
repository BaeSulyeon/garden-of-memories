import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface ReplyModalProps {
  petName: string;
  replyContent: string;
  emotionalTone: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReplyModal({
  petName,
  replyContent,
  emotionalTone,
  open,
  onOpenChange,
}: ReplyModalProps) {
  const getToneEmoji = (tone: string): string => {
    const toneEmojiMap: Record<string, string> = {
      affirming: "💪",
      comforting: "🤗",
      understanding: "💙",
      gentle: "🌸",
      nostalgic: "🌙",
      warm: "☀️",
      encouraging: "🌟",
      tender: "💝",
    };
    return toneEmojiMap[tone] || "💌";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center mb-4">
            {getToneEmoji(emotionalTone)} {petName}의 답장
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            {petName}이 당신의 편지에 답장을 보냈습니다
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* 답장 내용 */}
          <div className="p-6 bg-muted/50 rounded-lg border border-border/30">
            <p
              className="leading-relaxed text-foreground/90 whitespace-pre-line text-center italic"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {replyContent}
            </p>
          </div>

          {/* 감정 톤 표시 */}
          <div className="flex items-center justify-center gap-2">
            <div className="h-px flex-1 bg-border/30" />
            <span className="text-xs text-muted-foreground px-2">
              {emotionalTone === "affirming" && "격려의 메시지"}
              {emotionalTone === "comforting" && "위로의 메시지"}
              {emotionalTone === "understanding" && "공감의 메시지"}
              {emotionalTone === "gentle" && "부드러운 메시지"}
              {emotionalTone === "nostalgic" && "그리움의 메시지"}
              {emotionalTone === "warm" && "따뜻한 메시지"}
              {emotionalTone === "encouraging" && "응원의 메시지"}
              {emotionalTone === "tender" && "사랑의 메시지"}
            </span>
            <div className="h-px flex-1 bg-border/30" />
          </div>

          {/* 닫기 버튼 */}
          <div className="flex gap-2 justify-end pt-4">
            <Button onClick={() => onOpenChange(false)} className="gap-2">
              <Heart className="w-4 h-4" />
              감사합니다
            </Button>
          </div>

          {/* 하단 메시지 */}
          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground">
              이 답장은 당신의 마음 속에 영원히 남을 것입니다
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
