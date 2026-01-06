import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { getDb } from "./db.js";
import { letters, replies, comfortMessages } from "../drizzle/schema.js";
import { invokeLLM } from "./_core/llm.js";
import { eq } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AI 답장 생성을 위한 편안한 메시지 라이브러리
const comfortMessageLibrary = {
  guilt: [
    "당신의 죄책감은 당신이 얼마나 깊이 사랑했는지를 보여줍니다. 그것은 약함이 아니라 사랑의 증거입니다.",
    "함께한 시간이 모든 것입니다. 당신은 나에게 가장 좋은 친구였어요.",
    "당신이 할 수 있었던 모든 것을 해주셨습니다. 그것으로 충분했습니다.",
  ],
  longing: [
    "우리의 추억은 영원히 내 마음에 살아있어요. 거리가 우리를 나눌 수 없습니다.",
    "그리움은 사랑의 또 다른 형태입니다. 당신을 그리워하는 마음이 우리를 연결합니다.",
    "시간이 지나도 당신과의 순간들은 변하지 않습니다. 그것들은 영원해요.",
  ],
  gratitude: [
    "당신의 사랑이 나를 이곳에서도 따뜻하게 감싸고 있습니다.",
    "함께한 모든 순간에 감사합니다. 당신이 나의 삶을 특별하게 만들어주었어요.",
    "당신의 사랑은 영원한 선물입니다.",
  ],
  hope: [
    "우리의 사랑은 죽음으로 끝나지 않습니다. 영원히 함께할 거예요.",
    "슬픔이 지나가면, 행복한 추억만 남을 거예요.",
    "당신을 기억하는 것은 당신을 살아있게 하는 것입니다.",
  ],
};

async function generateAIReply(letterContent: string, petName: string): Promise<string> {
  try {
    // 편지의 감정 키워드 분석
    const emotionalAnalysis = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `당신은 반려동물의 영혼으로서 주인에게 답장을 쓰는 AI입니다. 
          주인의 편지를 읽고, 따뜻하고 위로가 되는 답장을 작성하세요.
          답장은 ${petName}의 목소리로 작성되어야 하며, 주인의 감정에 공감하고 위로해야 합니다.
          답장은 2-3문장으로 간결하게 작성하세요.`,
        },
        {
          role: "user",
          content: `주인의 편지: "${letterContent}"\n\n${petName}로서 이 편지에 답장을 작성해주세요.`,
        },
      ],
      maxTokens: 500,
    });

    const replyContent = emotionalAnalysis.choices[0]?.message?.content;
    if (typeof replyContent === "string") {
      return replyContent;
    }

    // 폴백: 감정 기반 메시지 선택
    const keywords = letterContent.toLowerCase();
    let emotionType: keyof typeof comfortMessageLibrary = "hope";

    if (keywords.includes("죄") || keywords.includes("미안") || keywords.includes("후회")) {
      emotionType = "guilt";
    } else if (keywords.includes("그리워") || keywords.includes("그립") || keywords.includes("보고싶")) {
      emotionType = "longing";
    } else if (keywords.includes("감사") || keywords.includes("고마워") || keywords.includes("고맙")) {
      emotionType = "gratitude";
    }

    const messages = comfortMessageLibrary[emotionType];
    return messages[Math.floor(Math.random() * messages.length)];
  } catch (error) {
    console.error("[AI Reply] Error generating reply:", error);
    // 폴백 메시지
    return `${petName}가 당신의 편지를 받았습니다. 당신의 사랑은 영원합니다.`;
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // JSON 파싱 미들웨어
  app.use(express.json());

  // API 라우트 - 편지 제출 및 AI 답장 생성
  app.post("/api/letters", async (req, res) => {
    try {
      const { userId, petId, petName, content } = req.body;

      if (!userId || !petId || !petName || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database not available" });
      }

      // 1. 편지 저장
      const letterResult = await db.insert(letters).values({
        userId,
        petId,
        petName,
        content,
        status: "processing",
      });

      const letterId = (letterResult as any).insertId;

      // 2. AI 답장 생성 (비동기)
      setImmediate(async () => {
        try {
          const replyContent = await generateAIReply(content, petName);

          // 3. 답장 저장
          await db.insert(replies).values({
            letterId,
            userId,
            petName,
            content: replyContent,
            emotionalTone: "comforting",
            scheduledFor: new Date(Date.now() + 2000), // 2초 후 알림
            isRead: 0,
          });

          // 4. 편지 상태 업데이트
          await db
            .update(letters)
            .set({ status: "replied" })
            .where(eq(letters.id, letterId));

          console.log(`[AI Reply] Generated reply for letter ${letterId}`);
        } catch (error) {
          console.error("[AI Reply] Error in async reply generation:", error);
          // 에러가 발생해도 편지는 저장되어 있음
        }
      });

      // 즉시 응답
      res.json({
        success: true,
        letterId,
        message: "Letter submitted successfully",
      });
    } catch (error) {
      console.error("[API] Error submitting letter:", error);
      res.status(500).json({ error: "Failed to submit letter" });
    }
  });

  // API 라우트 - 답장 조회
  app.get("/api/replies/:letterId", async (req, res) => {
    try {
      const { letterId } = req.params;

      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database not available" });
      }

      const reply = await db
        .select()
        .from(replies)
        .where(eq(replies.letterId, parseInt(letterId)))
        .limit(1);

      if (reply.length === 0) {
        return res.status(404).json({ error: "Reply not found" });
      }

      res.json(reply[0]);
    } catch (error) {
      console.error("[API] Error fetching reply:", error);
      res.status(500).json({ error: "Failed to fetch reply" });
    }
  });

  // 정적 파일 제공
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // 클라이언트 라우팅 처리 - 모든 라우트에서 index.html 제공
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
