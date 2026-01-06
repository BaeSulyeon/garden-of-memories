import { getDb } from "./db";
import { petPhotos } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * 특정 반려동물의 모든 사진 조회
 */
export async function getPetPhotos(petId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(petPhotos)
    .where(and(eq(petPhotos.petId, petId), eq(petPhotos.userId, userId)))
    .orderBy(petPhotos.displayOrder);
}

/**
 * 사진 추가
 */
export async function addPetPhoto(
  petId: number,
  userId: number,
  photoUrl: string,
  displayOrder: number
) {
  const db = await getDb();
  if (!db) return null;
  return await db.insert(petPhotos).values({
    petId,
    userId,
    photoUrl,
    displayOrder,
  });
}

/**
 * 사진 삭제
 */
export async function deletePetPhoto(photoId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  return await db
    .delete(petPhotos)
    .where(and(eq(petPhotos.id, photoId), eq(petPhotos.userId, userId)));
}

/**
 * 사진 순서 업데이트
 */
export async function updatePhotoOrder(
  photoId: number,
  userId: number,
  displayOrder: number
) {
  const db = await getDb();
  if (!db) return null;
  return await db
    .update(petPhotos)
    .set({ displayOrder })
    .where(and(eq(petPhotos.id, photoId), eq(petPhotos.userId, userId)));
}

/**
 * 반려동물의 모든 사진 순서 재정렬
 */
export async function reorderPetPhotos(
  petId: number,
  userId: number,
  photoIds: number[]
) {
  const db = await getDb();
  if (!db) return [];
  const updates = photoIds.map((id, index) =>
    db
      .update(petPhotos)
      .set({ displayOrder: index })
      .where(and(eq(petPhotos.id, id), eq(petPhotos.userId, userId)))
  );

  return await Promise.all(updates);
}
