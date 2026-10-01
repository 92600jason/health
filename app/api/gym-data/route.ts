import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { users, gymData } from "../../../db/schema";

async function ensureUser(userId: string) {
  const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (existing.length === 0) {
    const clerkUser = await currentUser();
    const email = clerkUser?.primaryEmailAddress?.emailAddress ?? null;
    await db.insert(users).values({ id: userId, email }).onConflictDoNothing();
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await ensureUser(userId);

  const rows = await db.select().from(gymData).where(eq(gymData.userId, userId)).limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ exerciseDb: [], routines: [], logs: [], draft: null });
  }

  return NextResponse.json({
    exerciseDb: rows[0].exerciseDb,
    routines: rows[0].routines,
    logs: rows[0].logs,
    draft: rows[0].draft ?? null,
  });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await ensureUser(userId);

  const body = await request.json();
  const { exerciseDb, routines, logs, draft } = body as {
    exerciseDb?: unknown;
    routines?: unknown;
    logs?: unknown;
    draft?: unknown;
  };

  const existing = await db.select().from(gymData).where(eq(gymData.userId, userId)).limit(1);

  if (existing.length === 0) {
    await db.insert(gymData).values({
      userId,
      exerciseDb: exerciseDb ?? [],
      routines: routines ?? [],
      logs: logs ?? [],
      draft: draft ?? null,
    });
  } else {
    const updateValues: Record<string, unknown> = { updatedAt: new Date() };
    if (exerciseDb !== undefined) updateValues.exerciseDb = exerciseDb;
    if (routines !== undefined) updateValues.routines = routines;
    if (logs !== undefined) updateValues.logs = logs;
    if (draft !== undefined) updateValues.draft = draft;

    await db.update(gymData).set(updateValues).where(eq(gymData.userId, userId));
  }

  return NextResponse.json({ ok: true });
}