import { pgTable, serial, text, integer, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

// 1. 유저 테이블
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. 운동 기록 메인 테이블 (userId 추가)
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }), // 로그인 유저 ID
  date: text("date").notNull(), // YYYY-MM-DD
  title: text("title").notNull(),
  routineName: text("routine_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 3. 운동 세트 상세 테이블
export const workoutSets = pgTable("workout_sets", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").references(() => workouts.id, { onDelete: "cascade" }),
  exerciseName: text("exercise_name").notNull(),
  category: text("category").notNull(),
  isOneArm: boolean("is_one_arm").default(false), // 원암 운동 여부
  setNumber: integer("set_number").notNull(),
  weight: integer("weight").default(0),
  reps: integer("reps").default(0),
  completed: boolean("completed").default(false),
});

// 4. 사용자 정의 루틴 테이블 (userId 추가)
export const routines = pgTable("routines", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }), // 로그인 유저 ID
  name: text("name").notNull(),
  targetDay: text("target_day"),
  exercises: text("exercises").notNull(), // JSON stringify 데이터
});