/*
 * Design Philosophy: Celestial Poetics
 * Page: Pet Profile (반려동물 상세 프로필)
 * - Full photo gallery with carousel
 * - Letter history with AI responses
 * - Chrysanthemum tributes (replaces likes)
 * - Comfort comments from community
 * - Share functionality
 */

import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { Heart, Share2, MessageCircle, Flower2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface PetProfileData {
  id: number;
  name: string;
  type: string;
  gender: string;
  age: number;
  profileImage: string;
  status: "함께하는 중" | "영원한 인연";
  photos: Array<{
    id: number;
    url: string;
  }>;
  letters: Array<{
    id: number;
    content: string;
    createdAt: string;
    reply?: {
      content: string;
      createdAt: string;
      status: "replied" | "waiting";
    };
  }>;
  tributes: number;
  comments: Array<{
    id: number;
    userName: string;
    content: string;
    createdAt: string;
    isAnonymous: boolean;
  }>;
}

export default function PetProfile() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/pet/:id");
  const [pet, setPet] = useState<PetProfileData | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [userTributed, setUserTributed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 샘플 데이터 로드
  useEffect(() => {
    const samplePet: PetProfileData = {
      id: 1,
      name: "별이",
      type: "강아지",
      gender: "수컷",
      age: 5,
      profileImage: "/images/moon-1.png",
      status: "영원한 인연",
      photos: [
        { id: 1, url: "/images/moon-1.png" },
        { id: 2, url: "/images/moon-2.png" },
        { id: 3, url: "/images/moon-3.png" },
      ],
      letters: [
        {
          id: 1,
          content: "별이, 너무 그리워. 함께 있던 시간들이 얼마나 소중했는지 이제야 알겠어.",
          createdAt: "2024-12-20",
          reply: {
            content: "당신의 사랑이 나를 이곳에서도 따뜻하게 감싸고 있어. 우리의 추억은 영원해.",
            createdAt: "2024-12-21",
            status: "replied",
          },
        },
        {
          id: 2,
          content: "오늘도 너를 생각했어. 언제쯤 이 마음이 편해질까?",
          createdAt: "2024-12-25",
          reply: undefined,
        },
      ],
      tributes: 24,
      comments: [
        {
          id: 1,
          userName: "익명",
          content: "별이를 추모합니다. 함께 있던 모든 순간이 소중했을 거예요.",
          createdAt: "2024-12-22",
          isAnonymous: true,
        },
        {
          id: 2,
          userName: "사용자A",
          content: "별이의 기억이 영원히 남기를 바랍니다. 힘내세요.",
          createdAt: "2024-12-23",
          isAnonymous: false,
        },
      ],
    };

    setPet(samplePet);
    setIsLoading(false);
  }, []);

  const handleAddTribute = () => {
    if (!userTributed) {
      setUserTributed(true);
      if (pet) {
        setPet({ ...pet, tributes: pet.tributes + 1 });
      }
      toast.success("국화를 놓았습니다. 별이를 추도합니다.");
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast.error("위로의 말씀을 입력해주세요.");
      return;
    }

    setIsLoadingComment(true);
    try {
      // 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newComment = {
        id: (pet?.comments.length || 0) + 1,
        userName: "익명",
        content: commentText,
        createdAt: new Date().toISOString().split("T")[0],
        isAnonymous: true,
      };

      if (pet) {
        setPet({ ...pet, comments: [...pet.comments, newComment] });
      }

      setCommentText("");
      toast.success("위로의 말씀이 전달되었습니다.");
    } catch (error) {
      toast.error("댓글 작성에 실패했습니다.");
    } finally {
      setIsLoadingComment(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/pet/${pet?.id}`;
    if (navigator.share) {
      navigator.share({
        title: `${pet?.name}의 기억`,
        text: `${pet?.name}를 추모합니다.`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("링크가 복사되었습니다.");
    }
  };

  if (isLoading || !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10">
        {/* 헤더 */}
        <div className="pt-6 px-4 md:px-8 flex justify-between items-center">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all text-white"
          >
            <Share2 className="w-4 h-4" />
            <span>공유하기</span>
          </button>
        </div>

        {/* 프로필 헤더 */}
        <div className="pt-8 px-4 md:px-8 text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl text-foreground font-light" style={{ fontFamily: "var(--font-heading)" }}>
              {pet.name}
            </h1>
            {pet.status === "영원한 인연" && (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm">
                영원한 인연
              </span>
            )}
          </div>
          <p className="text-muted-foreground">
            {pet.type} • {pet.gender} • {pet.age}세
          </p>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="px-4 md:px-8 pb-16">
          {/* 사진 갤러리 */}
          <div className="mb-12">
            <h2 className="text-2xl font-light mb-6 text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              기억들
            </h2>
            <div className="relative rounded-lg overflow-hidden bg-slate-800/50 backdrop-blur">
              <motion.img
                key={currentPhotoIndex}
                src={pet.photos[currentPhotoIndex].url}
                alt={`${pet.name} photo ${currentPhotoIndex + 1}`}
                className="w-full h-96 object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* 네비게이션 버튼 */}
              {pet.photos.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentPhotoIndex((prev) =>
                        prev === 0 ? pet.photos.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPhotoIndex((prev) =>
                        prev === pet.photos.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    →
                  </button>
                </>
              )}

              {/* 페이지 인디케이터 */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {pet.photos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPhotoIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentPhotoIndex
                        ? "bg-white w-6"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 국화 추도 및 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <motion.button
              onClick={handleAddTribute}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-lg text-center transition-all ${userTributed ? "bg-gradient-to-br from-pink-600 to-purple-600" : "bg-slate-800/50 hover:bg-slate-700/50"}`}
            >
              <Flower2 className={`w-6 h-6 mx-auto mb-2 ${userTributed ? "text-white" : "text-pink-400"}`} />
              <p className="text-sm font-medium text-foreground">국화 놓기</p>
              <p className="text-xs text-muted-foreground mt-1">{pet.tributes}</p>
            </motion.button>

            <div className="p-4 rounded-lg bg-slate-800/50 text-center">
              <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-sm font-medium text-foreground">위로 댓글</p>
              <p className="text-xs text-muted-foreground mt-1">{pet.comments.length}</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-800/50 text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-red-400" />
              <p className="text-sm font-medium text-foreground">편지</p>
              <p className="text-xs text-muted-foreground mt-1">{pet.letters.length}</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-800/50 text-center">
              <span className="text-2xl">📸</span>
              <p className="text-sm font-medium text-foreground mt-2">사진</p>
              <p className="text-xs text-muted-foreground mt-1">{pet.photos.length}</p>
            </div>
          </div>

          {/* 편지 히스토리 */}
          <div className="mb-12">
            <h2 className="text-2xl font-light mb-6 text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              편지와 답장
            </h2>
            <div className="space-y-6">
              {pet.letters.map((letter) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700/50"
                >
                  {/* 사용자 편지 */}
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">내 편지 • {letter.createdAt}</p>
                    <p className="text-foreground leading-relaxed">{letter.content}</p>
                  </div>

                  {/* AI 답장 */}
                  {letter.reply ? (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="pl-4 border-l-2 border-pink-500"
                    >
                      <p className="text-sm text-pink-400 mb-2">
                        {pet.name}의 답장 • {letter.reply.createdAt}
                      </p>
                      <p className="text-foreground leading-relaxed italic">
                        "{letter.reply.content}"
                      </p>
                    </motion.div>
                  ) : (
                    <div className="pl-4 border-l-2 border-yellow-500">
                      <p className="text-sm text-yellow-400 mb-2">답장 대기 중...</p>
                      <p className="text-muted-foreground text-sm">
                        {pet.name}의 따뜻한 답장을 기다리고 있습니다.
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* 위로 댓글 섹션 */}
          <div className="mb-12">
            <h2 className="text-2xl font-light mb-6 text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              위로의 말씀
            </h2>

            {/* 댓글 작성 폼 */}
            <div className="mb-8 bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700/50">
              <Textarea
                placeholder="한 마디로 위로해주세요... (최대 280자)"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value.slice(0, 280))}
                className="bg-slate-700/50 border-slate-600 text-foreground placeholder:text-muted-foreground mb-4 resize-none"
                rows={3}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {commentText.length}/280
                </p>
                <Button
                  onClick={handleAddComment}
                  disabled={isLoadingComment || !commentText.trim()}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  {isLoadingComment ? "전송 중..." : "위로 전달"}
                </Button>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {pet.comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 backdrop-blur rounded-lg p-4 border border-slate-700/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-foreground">
                      {comment.isAnonymous ? "익명" : comment.userName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {comment.createdAt}
                    </p>
                  </div>
                  <p className="text-foreground leading-relaxed">
                    {comment.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
