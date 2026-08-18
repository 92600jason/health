import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

// 운동 기록 메인 테이블
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // YYYY-MM-DD
  title: text("title").notNull(),
  routineName: text("routine_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 운동 세트 상세 테이블
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

// 사용자 정의 루틴 테이블
export const routines = pgTable("routines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  targetDay: text("target_day"),
  exercises: text("exercises").notNull(), // JSON stringify 데이터
});