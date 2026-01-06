import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function CosmicBackButton() {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    // 홈 화면에 petAdded 이벤트 발생
    window.dispatchEvent(new Event("petAdded"));
    setLocation("/");
  };

  return (
    <motion.button
      onClick={handleBack}
      className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 우주 배경 - 은하수 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* 별 애니메이션 배경 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 1,
              repeat: Infinity,
              delay: Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      {/* 테두리 - 은하수 테두리 */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* 내용 */}
      <div className="relative z-10 flex items-center gap-2">
        <motion.div
          animate={{ x: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowLeft className="w-5 h-5 text-white group-hover:text-white transition-colors" />
        </motion.div>
        <span className="text-white font-medium group-hover:text-white transition-colors">
          정원으로 돌아가기
        </span>
      </div>

      {/* 배경 기본 색상 */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-500 transition-all duration-300 -z-10 rounded-full" />

      {/* 글로우 효과 */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-50 blur-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 -z-20 transition-opacity duration-300" />
    </motion.button>
  );
}
