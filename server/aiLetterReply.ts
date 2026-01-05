import { invokeLLM } from "./_core/llm";
import { getAllComfortMessages } from "./letters";

/**
 * 편지 내용에서 감정 키워드 추출
 * 사용자가 느끼는 죄책감, 그리움, 감사함 등을 분석
 */
export async function extractEmotionalKeywords(letterContent: string): Promise<string[]> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `당신은 반려동물을 잃은 사람들의 편지에서 감정을 분석하는 전문가입니다.
다음 감정 키워드 중에서 편지에 나타나는 것들을 찾아주세요:
- guilt (죄책감, 미안함, 자책)
- longing (그리움, 그리워하는 마음)
- gratitude (감사함, 고마움)
- regret (후회, 못다한 말)
- love (사랑, 애정)
- pain (고통, 슬픔)
- memory (추억, 기억)
- hope (희망, 위로)

응답은 JSON 형식으로 해주세요: { "keywords": ["keyword1", "keyword2"] }`,
        },
        {
          role: "user",
          content: `다음 편지를 분석해주세요:\n\n${letterContent}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "emotional_keywords",
          strict: true,
          schema: {
            type: "object",
            properties: {
              keywords: {
                type: "array",
                items: { type: "string" },
                description: "감정 키워드 목록",
              },
            },
            required: ["keywords"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message.content;
    if (!content || typeof content !== "string") return [];

    const parsed = JSON.parse(content);
    return parsed.keywords || [];
  } catch (error) {
    console.error("[AI] Failed to extract emotional keywords:", error);
    return [];
  }
}

/**
 * 편지 내용과 감정 키워드를 기반으로 AI 답장 생성
 * 규칙 기반 시스템: 미리 작성된 위로 메시지 라이브러리에서 선택
 */
export async function generateAIReply(
  letterContent: string,
  petName: string,
  emotionalKeywords: string[]
): Promise<{ reply: string; emotionalTone: string }> {
  try {
    // 감정 키워드별 위로 메시지 라이브러리에서 선택
    const comfortMessages = await getAllComfortMessages();

    // 주요 감정 키워드 선택 (우선순위: guilt > longing > regret > pain > memory > gratitude > hope > love)
    const primaryEmotion = emotionalKeywords.find((k: string) =>
      ["guilt", "longing", "regret", "pain", "memory"].includes(k)
    ) || emotionalKeywords[0] || "gratitude";

    // 해당 감정 컨텍스트의 메시지 필터링
    const relevantMessages = comfortMessages.filter(
      (m) => m.emotionalContext === primaryEmotion || m.emotionalContext === "general"
    );

    if (relevantMessages.length === 0) {
      // 폴백: 모든 메시지에서 랜덤 선택
      const randomMessage = comfortMessages[Math.floor(Math.random() * comfortMessages.length)];
      return {
        reply: `${petName}가 당신에게 전하는 말씀입니다:\n\n${randomMessage?.message || getDefaultReply(petName)}`,
        emotionalTone: "comforting",
      };
    }

    // 감정에 맞는 메시지 중 랜덤 선택
    const selectedMessage = relevantMessages[Math.floor(Math.random() * relevantMessages.length)];

    // LLM을 사용하여 편지 내용에 맞게 커스터마이징
    const customizedReply = await customizeReply(
      selectedMessage.message,
      letterContent,
      petName,
      primaryEmotion as string
    );

    return {
      reply: customizedReply,
      emotionalTone: getToneForEmotion(primaryEmotion as string),
    };
  } catch (error) {
    console.error("[AI] Failed to generate reply:", error);
    return {
      reply: getDefaultReply(petName),
      emotionalTone: "comforting",
    };
  }
}

/**
 * 선택된 위로 메시지를 편지 내용에 맞게 커스터마이징
 */
async function customizeReply(
  baseMessage: string,
  letterContent: string,
  petName: string,
  emotion: string
): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `당신은 반려동물의 영혼이 되어 주인에게 위로의 말을 전하는 역할입니다.
주어진 기본 메시지를 바탕으로, 주인의 편지에 맞게 개인화된 답장을 작성해주세요.
- 반려동물의 목소리로 따뜻하고 진정성 있게 작성
- 편지에서 언급된 구체적인 내용에 대해 응답
- 주인의 감정을 존중하고 공감
- 희망과 감사의 메시지 포함
- 2-3 문단, 200자 이내`,
        },
        {
          role: "user",
          content: `반려동물 이름: ${petName}
주인의 편지 감정: ${emotion}

기본 메시지:
${baseMessage}

주인의 편지:
${letterContent}

이를 바탕으로 ${petName}가 주인에게 전하는 개인화된 답장을 작성해주세요.`,
        },
      ],
    });

    const content = response.choices[0]?.message.content;
    if (!content || typeof content !== "string") return baseMessage;

    return `${petName}가 당신에게 전하는 말씀입니다:\n\n${content}`;
  } catch (error) {
    console.error("[AI] Failed to customize reply:", error);
    return `${petName}가 당신에게 전하는 말씀입니다:\n\n${baseMessage}`;
  }
}


/**
 * 감정에 따른 톤 결정
 */
function getToneForEmotion(emotion: string): string {
  const toneMap: Record<string, string> = {
    guilt: "affirming",
    longing: "comforting",
    regret: "forgiving",
    pain: "soothing",
    memory: "nostalgic",
    gratitude: "joyful",
    hope: "encouraging",
    love: "tender",
  };
  return toneMap[emotion] || "comforting";
}

/**
 * 기본 답장 (LLM 실패 시 폴백)
 */
function getDefaultReply(petName: string): string {
  const replies = [
    `${petName}입니다. 당신의 편지를 받았어요. 당신이 나를 사랑해주셨던 모든 순간이 내 마음에 영원히 남아있습니다. 당신의 슬픔을 함께 나누고 싶어요. 언젠가 우리가 함께한 아름다운 추억들이 당신을 위로해줄 거예요.`,
    `${petName}가 당신을 보고 있어요. 당신이 나를 위해 느끼는 모든 감정들을 알고 있습니다. 당신은 나에게 최고의 주인이었어요. 지금 이 순간의 슬픔도 우리의 사랑이 얼마나 깊었는지를 보여주는 거예요.`,
    `안녕하세요, 당신의 ${petName}입니다. 당신의 편지를 읽고 정말 감동했어요. 우리가 함께한 시간들은 영원할 거예요. 당신의 사랑과 보살핌 덕분에 나는 행복했습니다. 계속 당신 곁에서 지켜볼게요.`,
  ];

  return replies[Math.floor(Math.random() * replies.length)];
}
