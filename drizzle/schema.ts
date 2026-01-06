import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Letters table - stores letters written by users to their pets
 * Design Philosophy: 별빛 우체통 (Starlight Mailbox)
 * - Users write letters expressing guilt, longing, and untold stories
 * - Letters are stored with emotional metadata for AI analysis
 */
export const letters = mysqlTable("letters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  petId: int("petId").notNull(), // Reference to pet (can be from sample data or user-created)
  petName: varchar("petName", { length: 255 }).notNull(), // Store pet name for reference
  content: text("content").notNull(), // Letter content
  emotionalKeywords: text("emotionalKeywords"), // Comma-separated keywords (guilt, longing, gratitude, etc.)
  status: mysqlEnum("status", ["sent", "processing", "replied"]).default("sent").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Letter = typeof letters.$inferSelect;
export type InsertLetter = typeof letters.$inferInsert;

/**
 * Replies table - stores AI-generated replies from pets
 * Design Philosophy: 별의 답장 (Star's Reply)
 * - AI analyzes emotional content and generates comforting responses
 * - Replies are delayed (12-24 hours) to create anticipation
 * - Each reply is curated from a library of genuine comfort messages
 */
export const replies = mysqlTable("replies", {
  id: int("id").autoincrement().primaryKey(),
  letterId: int("letterId").notNull(),
  userId: int("userId").notNull(),
  petName: varchar("petName", { length: 255 }).notNull(),
  content: text("content").notNull(), // AI-generated reply
  emotionalTone: varchar("emotionalTone", { length: 100 }), // e.g., "comforting", "affirming", "hopeful"
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  scheduledFor: timestamp("scheduledFor"), // When to notify user
  notifiedAt: timestamp("notifiedAt"), // When user was notified
  isRead: int("isRead").default(0).notNull(), // 0 = unread, 1 = read
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Reply = typeof replies.$inferSelect;
export type InsertReply = typeof replies.$inferInsert;

/**
 * Comfort messages library - pre-written messages for AI to choose from
 * These are curated based on user research about what grieving pet owners want to hear
 */
export const comfortMessages = mysqlTable("comfortMessages", {
  id: int("id").autoincrement().primaryKey(),
  emotionalContext: varchar("emotionalContext", { length: 100 }).notNull(), // e.g., "guilt", "longing", "gratitude"
  message: text("message").notNull(),
  author: varchar("author", { length: 255 }), // "pet_voice" or other attribution
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ComfortMessage = typeof comfortMessages.$inferSelect;
export type InsertComfortMessage = typeof comfortMessages.$inferInsert;

/**
 * Pets table - stores user's own pets
 * Design Philosophy: 나의 정원 (My Garden)
 * - Users can add their own pets with information and photos
 * - Each pet has a status (함께하는 중, 영원한 인연)
 */
export const pets = mysqlTable("pets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // 강아지, 고양이, 토끼, etc.
  gender: varchar("gender", { length: 50 }).notNull(), // 수컷, 암컷
  age: int("age"), // 나이 (세)
  status: mysqlEnum("status", ["함께하는 중", "영원한 인연"]).default("함께하는 중").notNull(),
  profileImage: text("profileImage"), // S3 URL for main pet photo
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pet = typeof pets.$inferSelect;
export type InsertPet = typeof pets.$inferInsert;

/**
 * Pet photos table - stores multiple photos for each pet
 * Design Philosophy: 기억들 (Memories)
 * - Users can upload multiple photos of their pets
 * - Photos are stored in S3 with metadata
 * - Users can add, delete, and reorder photos
 */
export const petPhotos = mysqlTable("petPhotos", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull(),
  userId: int("userId").notNull(),
  photoUrl: text("photoUrl").notNull(), // S3 URL
  displayOrder: int("displayOrder").default(0).notNull(), // For ordering in carousel
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PetPhoto = typeof petPhotos.$inferSelect;
export type InsertPetPhoto = typeof petPhotos.$inferInsert;
