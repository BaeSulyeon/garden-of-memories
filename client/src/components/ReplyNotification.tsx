import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReplyNotificationProps {
  petName: string;
  onDismiss: () => void;
  onOpen: () => void;
}

export default function ReplyNotification({
  petName,
  onDismiss,
  onOpen,
}: ReplyNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 max-w-sm z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-card border border-border/50 rounded-lg shadow-lg p-4 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Bell className="w-5 h-5 text-accent animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm">
              {petName}로부터 답장이 도착했습니다
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {petName}이 당신의 편지에 따뜻한 답장을 보냈습니다.
            </p>
          </div>

          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            onClick={() => {
              onOpen();
              setIsVisible(false);
            }}
            className="flex-1"
          >
            답장 보기
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onDismiss();
              setIsVisible(false);
            }}
          >
            나중에
          </Button>
        </div>
      </div>
    </div>
  );
}
