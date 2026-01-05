import { useEffect, useState } from "react";
import { Mail, Heart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Letter {
  id: number;
  petName: string;
  content: string;
  status: "sent" | "processing" | "replied";
  createdAt: string;
}

interface Reply {
  id: number;
  letterId: number;
  petName: string;
  content: string;
  emotionalTone: string;
  createdAt: string;
}

export default function LetterHistory() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [activeTab, setActiveTab] = useState<"letters" | "replies">("letters");

  useEffect(() => {
    // TODO: API에서 편지 목록 조회
    // const fetchLetters = async () => {
    //   const result = await trpc.letters.getMyLetters.query();
    //   setLetters(result);
    // };
    // fetchLetters();
  }, []);

  useEffect(() => {
    // TODO: API에서 답장 목록 조회
    // const fetchReplies = async () => {
    //   const result = await trpc.letters.getMyReplies.query();
    //   setReplies(result);
    // };
    // fetchReplies();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      sent: { label: "전송됨", color: "bg-blue-100 text-blue-800" },
      processing: { label: "처리 중", color: "bg-yellow-100 text-yellow-800" },
      replied: { label: "답장 받음", color: "bg-green-100 text-green-800" },
    };
    const status_info = statusMap[status] || statusMap.sent;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${status_info.color}`}>
        {status_info.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">편지 기록</h1>
            <p className="text-muted-foreground">
              반려동물과 나눈 모든 편지와 답장을 기억하세요
            </p>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 mb-6 border-b border-border">
            <Button
              variant={activeTab === "letters" ? "default" : "ghost"}
              onClick={() => setActiveTab("letters")}
              className="gap-2"
            >
              <Mail className="w-4 h-4" />
              내 편지 ({letters.length})
            </Button>
            <Button
              variant={activeTab === "replies" ? "default" : "ghost"}
              onClick={() => setActiveTab("replies")}
              className="gap-2"
            >
              <Heart className="w-4 h-4" />
              받은 답장 ({replies.length})
            </Button>
          </div>

          {/* 편지 목록 */}
          {activeTab === "letters" && (
            <div className="space-y-4">
              {letters.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    아직 보낸 편지가 없습니다
                  </p>
                  <Link href="/">
                    <Button className="mt-4">정원으로 돌아가기</Button>
                  </Link>
                </div>
              ) : (
                letters.map((letter) => (
                  <div
                    key={letter.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">
                        {letter.petName}에게 보낸 편지
                      </h3>
                      {getStatusBadge(letter.status)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {letter.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDate(letter.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 답장 목록 */}
          {activeTab === "replies" && (
            <div className="space-y-4">
              {replies.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    아직 받은 답장이 없습니다
                  </p>
                  <Link href="/">
                    <Button className="mt-4">정원으로 돌아가기</Button>
                  </Link>
                </div>
              ) : (
                replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">
                        {reply.petName}의 답장
                      </h3>
                      <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent">
                        {reply.emotionalTone}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2 italic">
                      {reply.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDate(reply.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
