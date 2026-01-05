import { eq, desc } from "drizzle-orm";
import { letters, replies, comfortMessages, InsertLetter, InsertReply } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * 사용자의 편지 목록 조회
 */
export async function getUserLetters(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(letters)
    .where(eq(letters.userId, userId))
    .orderBy(desc(letters.sentAt));
}

/**
 * 편지 작성 및 저장
 */
export async function createLetter(data: InsertLetter) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(letters).values(data);
  return result;
}

/**
 * 편지 상태 업데이트
 */
export async function updateLetterStatus(
  letterId: number,
  status: "sent" | "processing" | "replied"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(letters)
    .set({ status, updatedAt: new Date() })
    .where(eq(letters.id, letterId));
}

/**
 * 사용자의 답장 목록 조회
 */
export async function getUserReplies(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(replies)
    .where(eq(replies.userId, userId))
    .orderBy(desc(replies.generatedAt));
}

/**
 * 미읽은 답장 개수
 */
export async function getUnreadReplyCount(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(replies)
    .where(eq(replies.userId, userId) && eq(replies.isRead, 0));

  return result.length;
}

/**
 * 답장 생성 및 저장
 */
export async function createReply(data: InsertReply) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(replies).values(data);
  return result;
}

/**
 * 답장 읽음 표시
 */
export async function markReplyAsRead(replyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(replies)
    .set({ isRead: 1, updatedAt: new Date() })
    .where(eq(replies.id, replyId));
}

/**
 * 감정 컨텍스트에 맞는 위로 메시지 조회
 */
export async function getComfortMessages(emotionalContext: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(comfortMessages)
    .where(eq(comfortMessages.emotionalContext, emotionalContext) && eq(comfortMessages.isActive, 1));
}

/**
 * 모든 활성 위로 메시지 조회 (기본값)
 */
export async function getAllComfortMessages() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(comfortMessages)
    .where(eq(comfortMessages.isActive, 1));
}
