import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function GardenNavigation() {
  const [location, navigate] = useLocation();

  const isHome = location === "/";
  const isMyGarden = location === "/my-garden";

  return (
    <motion.div
      className="fixed top-6 right-6 z-50 flex gap-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      {isHome && (
        <Button
          onClick={() => navigate("/my-garden")}
          className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 gap-2"
        >
          <Heart className="w-4 h-4" />
          나의 정원
        </Button>
      )}

      {isMyGarden && (
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="border-pink-400/50 hover:border-pink-400 hover:bg-pink-400/10 gap-2"
        >
          <Home className="w-4 h-4" />
          기억의 정원
        </Button>
      )}
    </motion.div>
  );
}
