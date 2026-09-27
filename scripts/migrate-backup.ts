// 실행 방법:
// 1) 프로젝트 루트에 scripts 폴더 만들고 이 파일을 scripts/migrate-backup.ts 로 저장
// 2) 카톡으로 백업해둔 backup_all_....json 파일을 프로젝트 폴더 아무 데나 복사
// 3) 터미널에서: npx tsx scripts/migrate-backup.ts ./backup_all_2026-09-25.json <Clerk User ID>
//    (Clerk User ID는 Clerk 대시보드 > Users 에서 본인 계정 클릭하면 "user_"로 시작하는 ID 확인 가능)

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import { eq } from "drizzle-orm";

function parseIfString(value: unknown) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

async function main() {
  // db와 schema는 여기서 "동적으로" 불러옵니다.
  // 위의 dotenv.config()가 확실히 먼저 실행된 뒤에 DB 연결이 생성되도록 하기 위함입니다.
  const { db } = await import("../db");
  const { users, gymData } = await import("../db/schema");

  const [, , backupPath, clerkUserId] = process.argv;

  if (!backupPath || !clerkUserId) {
    console.error(
      "사용법: npx tsx scripts/migrate-backup.ts <backup.json 경로> <Clerk User ID>"
    );
    process.exit(1);
  }

  const raw = fs.readFileSync(backupPath, "utf-8");
  const backup = JSON.parse(raw);

  const logs = parseIfString(backup["gym_logs"]) ?? [];
  const routines = parseIfString(backup["gym_routines"]) ?? [];
  const exerciseDb = parseIfString(backup["gym_exercise_db"]) ?? [];

  console.log(
    `가져온 데이터 — 운동 기록: ${Array.isArray(logs) ? logs.length : "?"}개, ` +
      `루틴: ${Array.isArray(routines) ? routines.length : "?"}개, ` +
      `종목: ${Array.isArray(exerciseDb) ? exerciseDb.length : "?"}개`
  );

  if (backup["gym_custom_db"]) {
    console.log(
      "⚠️ gym_custom_db 키가 백업에 있지만 스키마가 달라서 자동 병합하지 않았습니다. " +
        "필요하면 내용을 확인 후 수동으로 종목을 다시 추가해주세요."
    );
  }

  const existingUser = await db.select().from(users).where(eq(users.id, clerkUserId)).limit(1);
  if (existingUser.length === 0) {
    await db.insert(users).values({ id: clerkUserId, email: null });
    console.log("유저 레코드 생성됨:", clerkUserId);
  }

  const existingData = await db
    .select()
    .from(gymData)
    .where(eq(gymData.userId, clerkUserId))
    .limit(1);

  if (existingData.length === 0) {
    await db.insert(gymData).values({ userId: clerkUserId, exerciseDb, routines, logs });
    console.log("새 데이터 삽입 완료");
  } else {
    await db
      .update(gymData)
      .set({ exerciseDb, routines, logs, updatedAt: new Date() })
      .where(eq(gymData.userId, clerkUserId));
    console.log("기존 데이터 덮어쓰기 완료");
  }

  console.log("✅ 마이그레이션 완료!");
  process.exit(0);
}

main().catch((err) => {
  console.error("마이그레이션 실패:", err);
  process.exit(1);
});