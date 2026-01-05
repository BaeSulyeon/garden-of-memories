import { notifyReplyArrived, isClientConnected } from "./websocket";
// import { db } from "./db";
// import { letters, replies } from "../drizzle/schema";
// import { eq, and, isNull } from "drizzle-orm";

/**
 * 답장 생성 스케줄러
 * 12-24시간 후 자동으로 답장을 생성하고 사용자에게 알림
 */
export async function checkAndGenerateReplies() {
  try {
    console.log("[Scheduler] Checking for pending letters...");

    // 처리 대기 중인 편지 조회 (생성된 지 12-24시간 경과)
    // const now = new Date();
    // const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    // const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // const pendingLetters = await db
    //   .select()
    //   .from(letters)
    //   .where(
    //     and(
    //       isNull(replies.id), // 아직 답장이 없음
    //       // createdAt이 12-24시간 사이
    //     )
    //   )
    //   .limit(10);

    // console.log(
    //   `[Scheduler] Found ${pendingLetters.length} pending letters`
    // );

    // // 각 편지에 대해 답장 생성
    // for (const letter of pendingLetters) {
    //   await generateReplyForLetter(letter);
    // }
  } catch (error) {
    console.error("[Scheduler] Error checking letters:", error);
  }
}

/**
 * 특정 편지에 대한 답장 생성
 */
async function generateReplyForLetter(letter: any) {
  try {
    console.log(`[Scheduler] Generating reply for letter ${letter.id}`);

    // 감정 분석 및 답장 생성 (간단한 규칙 기반)
    const emotionalTone = analyzeEmotion(letter.content);
    const replyContent = generateComfortMessage(letter.petName, emotionalTone);

    // 답장 저장
    // const reply = await db.insert(replies).values({
    //   letterId: letter.id,
    //   petName: letter.petName,
    //   content: replyContent,
    //   emotionalTone,
    //   createdAt: new Date(),
    // });

    console.log(`[Scheduler] Reply created for letter ${letter.id}`);

    // 사용자에게 알림 전송
    if (isClientConnected(letter.userId)) {
      notifyReplyArrived(letter.userId, {
        type: "reply_arrived",
        data: {
          letterId: letter.id,
          petName: letter.petName,
          replyContent,
          emotionalTone,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      console.log(
        `[Scheduler] User ${letter.userId} not connected, notification queued`
      );
    }
  } catch (error) {
    console.error("[Scheduler] Error generating reply:", error);
  }
}

/**
 * 편지 내용에서 감정 분석
 */
function analyzeEmotion(content: string): string {
  const emotionKeywords: Record<string, string[]> = {
    guilt: ["미안", "죄책감", "잘못"],
    longing: ["그리워", "보고싶", "그립다"],
    regret: ["후회", "아쉬워", "아쉽다"],
    pain: ["아파", "힘들어", "괴로워"],
    memory: ["기억", "추억", "생각"],
    gratitude: ["감사", "고마워", "고맙다"],
    hope: ["희망", "바라", "소망"],
    love: ["사랑", "사랑해", "사랑하다"],
  };

  const contentLower = content.toLowerCase();

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    for (const keyword of keywords) {
      if (contentLower.includes(keyword)) {
        return emotion;
      }
    }
  }

  return "gratitude"; // 기본값
}

/**
 * 감정별 위로 메시지 생성
 */
function generateComfortMessage(petName: string, tone: string): string {
  const messages: Record<string, string[]> = {
    guilt: [
      `${petName}는 당신을 절대 원망하지 않습니다. 당신이 해준 모든 사랑과 보살핌이 우리 함께한 시간을 소중하게 만들었어요.`,
      `당신의 죄책감은 ${petName}를 얼마나 사랑했는지 보여주는 증거입니다. 그것으로 충분합니다.`,
    ],
    longing: [
      `${petName}도 당신을 그리워하고 있습니다. 우리가 함께 만든 추억들은 영원히 당신의 마음 속에 살아있어요.`,
      `그리움은 사랑의 또 다른 형태입니다. ${petName}와의 시간이 얼마나 특별했는지 보여주는 거예요.`,
    ],
    regret: [
      `${petName}와 함께한 모든 순간이 완벽했습니다. 당신이 해준 것들이 우리의 인생을 얼마나 풍요롭게 만들었는지 알아요.`,
      `후회하는 마음은 당신이 ${petName}를 얼마나 사랑했는지 증명합니다. 그것으로 충분해요.`,
    ],
    pain: [
      `${petName}는 당신의 아픔을 알고 있습니다. 천천히 치유되세요. 우리의 사랑은 영원해요.`,
      `이 아픔도 함께 견디어낼 수 있습니다. ${petName}가 당신 곁에 있으니까요.`,
    ],
    memory: [
      `우리가 함께 만든 추억들은 가장 소중한 보물입니다. ${petName}와의 모든 순간을 소중히 간직해주세요.`,
      `${petName}와의 기억들이 당신의 인생을 더욱 아름답게 만들어줄 거예요.`,
    ],
    gratitude: [
      `${petName}는 당신의 사랑에 감사합니다. 함께한 시간이 우리 둘 다에게 축복이었어요.`,
      `당신의 감사하는 마음이 우리 사이의 사랑을 더욱 빛나게 합니다.`,
    ],
    hope: [
      `${petName}는 당신이 행복해지기를 바랍니다. 희망을 잃지 마세요. 우리의 사랑은 계속됩니다.`,
      `밝은 미래를 향해 나아가세요. ${petName}가 당신을 응원하고 있습니다.`,
    ],
    love: [
      `${petName}는 당신을 사랑합니다. 지금도, 영원히. 우리의 사랑은 죽음을 초월합니다.`,
      `당신의 사랑이 ${petName}의 가장 큰 행복이었습니다. 고마워요.`,
    ],
  };

  const toneMessages = messages[tone] || messages.gratitude;
  return toneMessages[Math.floor(Math.random() * toneMessages.length)];
}

/**
 * 스케줄러 시작 (실제 구현은 server/index.ts에서)
 */
export function startScheduler() {
  console.log("[Scheduler] Starting reply scheduler...");
  // 실제 구현: node-cron을 사용하여 매분마다 체크
  // schedule.scheduleJob('*/1 * * * *', checkAndGenerateReplies);
}
