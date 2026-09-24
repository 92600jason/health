import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { workouts, workoutSets } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { localWorkouts } = await request.json();

    if (!localWorkouts || localWorkouts.length === 0) {
      return NextResponse.json({ message: '이관할 local 데이터가 없습니다.' }, { status: 200 });
    }

    for (const item of localWorkouts) {
      const [insertedWorkout] = await db.insert(workouts).values({
        userId: userId,
        date: item.date,
        title: item.title,
        routineName: item.routineName || null,
      }).returning();

      if (item.sets && item.sets.length > 0) {
        const setsToInsert = item.sets.map((s: any) => ({
          workoutId: insertedWorkout.id,
          exerciseName: s.exerciseName,
          category: s.category,
          isOneArm: s.isOneArm ?? false,
          setNumber: s.setNumber,
          weight: s.weight ?? 0,
          reps: s.reps ?? 0,
          completed: s.completed ?? false,
        }));

        await db.insert(workoutSets).values(setsToInsert);
      }
    }

    return NextResponse.json({ success: true, migratedCount: localWorkouts.length });
  } catch (error) {
    console.error('Migration API Error:', error);
    return NextResponse.json({ error: '데이터 이관 중 오류가 발생했습니다.' }, { status: 500 });
  }
}