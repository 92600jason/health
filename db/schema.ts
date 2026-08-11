import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

// 운동 기록 메인 테이블
export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  date: text('date').notNull(), // YYYY-MM-DD
  title: text('title').notNull(), // 예: 상체 A, 하체 B
  createdAt: timestamp('created_at').defaultNow(),
});

// 세부 세트 기록 테이블
export const workoutSets = pgTable('workout_sets', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id').references(() => workouts.id),
  exerciseName: text('exercise_name').notNull(), // 예: 스미스 벤치프레스
  targetPart: text('target_part'), // 예: 가슴, 삼두, 악력
  weight: integer('weight').notNull(), // 무게 (kg)
  reps: integer('reps').notNull(), // 반복 횟수 (회)
  restTime: integer('rest_time'), // 휴식 시간 (초)
});