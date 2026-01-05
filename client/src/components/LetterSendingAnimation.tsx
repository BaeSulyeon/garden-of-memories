import { useEffect, useState } from "react";

interface LetterSendingAnimationProps {
  isVisible: boolean;
  petName: string;
}

export default function LetterSendingAnimation({
  isVisible,
  petName,
}: LetterSendingAnimationProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowSuccess(false);
      const timer = setTimeout(() => {
        setShowSuccess(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="relative w-32 h-32">
        {/* 종이비행기 애니메이션 */}
        <div
          className="absolute inset-0 flex items-center justify-center text-4xl"
          style={{
            animation: showSuccess
              ? "none"
              : "paper-plane-fly 2s ease-in-out forwards",
          }}
        >
          ✈️
        </div>

        {/* 성공 메시지 */}
        {showSuccess && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-center text-sm font-medium text-foreground">
              {petName}에게 편지가 전달되었습니다
            </p>
            <p className="text-center text-xs text-muted-foreground mt-2">
              12-24시간 후 답장을 받을 수 있습니다
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes paper-plane-fly {
          0% {
            opacity: 1;
            transform: translateX(-100px) translateY(100px) rotate(0deg) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateX(50px) translateY(-50px) rotate(-15deg) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translateX(200px) translateY(-200px) rotate(-30deg) scale(0.5);
          }
        }
      `}</style>
    </div>
  );
}
