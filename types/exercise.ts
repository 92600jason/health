export type ExerciseType = 'weight' | 'reps_only' | 'cardio';

export interface SetLog {
  id: string;
  reps?: number;
  weight?: number; // 맨몸 운동 시 중량(+kg) 또는 보조(-kg) 입력 가능
  durationMinutes?: number;
  distanceKm?: number;
}

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  sets: SetLog[];
}