import express, { Request, Response } from "express";
import { getDb } from "./db";
import { pets, letters } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// API 라우트 (정적 파일 제공 BEFORE)
// ============================================

// 반려동물 조회
app.get("/api/pets", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const allPets = await db.select().from(pets);
    res.json(allPets);
  } catch (error) {
    console.error("Failed to fetch pets:", error);
    res.status(500).json({ error: "Failed to fetch pets" });
  }
});

// 반려동물 저장
app.post("/api/pets", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const { name, type, gender, age, status, profileImage, userId } = req.body;
    
    const newPet = await db.insert(pets).values({
      userId: userId || 1, // Default to user 1 for now
      name,
      type,
      gender,
      age,
      status: status || "함께하는 중",
      profileImage,
    }).$returningId();
    
    res.json({ id: newPet[0].id, name, type, gender, age, status });
  } catch (error) {
    console.error("Failed to save pet:", error);
    res.status(500).json({ error: "Failed to save pet" });
  }
});

// 편지 제출
app.post("/api/letters", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const { petId, petName, content, userId } = req.body;
    
    // 편지 저장
    const newLetter = await db.insert(letters).values({
      userId: userId || 1, // Default to user 1 for now
      petId,
      petName,
      content,
      status: "processing",
    }).$returningId();
    
    res.json({ success: true, letterId: newLetter[0].id });
  } catch (error) {
    console.error("Failed to submit letter:", error);
    res.status(500).json({ error: "Failed to submit letter" });
  }
});

// 답장 조회
app.get("/api/replies/:letterId", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }
    const { letterId } = req.params;
    const letter = await db.select().from(letters).where(eq(letters.id, parseInt(letterId)));
    
    if (letter.length === 0) {
      return res.status(404).json({ error: "Letter not found" });
    }
    
    res.json(letter[0]);
  } catch (error: unknown) {
    console.error("Failed to fetch reply:", error);
    res.status(500).json({ error: "Failed to fetch reply" });
  }
});

// ============================================
// 정적 파일 제공
// ============================================
const distPath = path.join(__dirname, "../client/dist");
app.use(express.static(distPath));

// ============================================
// 클라이언트 라우팅
// ============================================
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ============================================
// 서버 시작
// ============================================
async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error: unknown) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
