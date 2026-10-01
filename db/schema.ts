import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

// 1. 유저 테이블 — id는 Clerk의 userId를 그대로 사용 (예: "user_2abc...")
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. 헬스 기록 전체를 JSON 덩어리로 저장하는 테이블 (유저 1명당 1행)
export const gymData = pgTable("gym_data", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  exerciseDb: jsonb("exercise_db").notNull().default([]),
  routines: jsonb("routines").notNull().default([]),
  logs: jsonb("logs").notNull().default([]),
  // 작성 중인(아직 저장 안 한) 운동 임시저장. { date, title, exercises } 형태.
  // date가 오늘이 아니면 불러올 때 무시 — 자정이 지나면 자동으로 초기화되는 효과.
  draft: jsonb("draft"),
  updatedAt: timestamp("updated_at").defaultNow(),
});