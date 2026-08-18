"use client";

import React, { useState } from "react";

// 요청사항이 모두 반영된 부위별 세부 운동 데이터베이스
const EXERCISE_DATABASE = [
  // ================= 가슴 (바벨 / 덤벨 / 스미스 / 케이블 구분) =================
  { name: "바벨 벤치프레스", category: "가슴", isOneArm: false },
  { name: "덤벨 벤치프레스", category: "가슴", isOneArm: false },
  { name: "스미스 머신 벤치프레스", category: "가슴", isOneArm: false },
  { name: "바벨 인클라인 벤치프레스", category: "가슴", isOneArm: false },
  { name: "덤벨 인클라인 벤치프레스", category: "가슴", isOneArm: false },
  { name: "스미스 머신 인클라인 프레스", category: "가슴", isOneArm: false },
  { name: "덤벨 체스트 플라이", category: "가슴", isOneArm: false },
  { name: "케이블 체스트 플라이", category: "가슴", isOneArm: false },
  { name: "원암 케이블 체스트 플라이", category: "가슴", isOneArm: true },
  { name: "딥스", category: "가슴", isOneArm: false },

  // ================= 등 (풀다운 강화 & 로우 보존) =================
  { name: "렛풀다운 (오버그립)", category: "등", isOneArm: false },
  { name: "렛풀다운 (언더그립)", category: "등", isOneArm: false },
  { name: "클로즈그립 렛풀다운", category: "등", isOneArm: false },
  { name: "원암 케이블 렛풀다운", category: "등", isOneArm: true },
  { name: "케이블 암 풀다운 (스트레이트 바)", category: "등", isOneArm: false },
  { name: "풀업 (턱걸이)", category: "등", isOneArm: false },
  { name: "바벨로우", category: "등", isOneArm: false },
  { name: "스미스 머신 바벨로우", category: "등", isOneArm: false },
  { name: "덤벨로우", category: "등", isOneArm: false },
  { name: "원암 덤벨로우", category: "등", isOneArm: true },
  { name: "시티드 케이블로우", category: "등", isOneArm: false },
  { name: "원암 케이블로우", category: "등", isOneArm: true },
  { name: "컨벤셔널 데드리프트", category: "등", isOneArm: false },

  // ================= 어깨 (전면 / 측면 / 후면 & 바벨/덤벨/스미스 구분) =================
  { name: "[전면] 바벨 오버헤드 프레스", category: "어깨", isOneArm: false },
  { name: "[전면] 덤벨 숄더 프레스", category: "어깨", isOneArm: false },
  { name: "[전면] 스미스 머신 숄더 프레스", category: "어깨", isOneArm: false },
  { name: "[전면] 덤벨 프론트 레이즈", category: "어깨", isOneArm: false },
  { name: "[전면] 케이블 프론트 레이즈", category: "어깨", isOneArm: false },
  { name: "[측면] 덤벨 사이드 레이터럴 레이즈", category: "어깨", isOneArm: false },
  { name: "[측면] 원암 덤벨 사이드 레이터럴 레이즈", category: "어깨", isOneArm: true },
  { name: "[측면] 케이블 사이드 레이터럴 레이즈", category: "어깨", isOneArm: false },
  { name: "[측면] 원암 케이블 사이드 레이터럴 레이즈", category: "어깨", isOneArm: true },
  { name: "[후면] 덤벨 리버스 플라이", category: "후면어깨", isOneArm: false },
  { name: "[후면] 케이블 리버스 펙덱 플라이", category: "후면어깨", isOneArm: false },
  { name: "[후면] 케이블 페이스풀", category: "후면어깨", isOneArm: false },

  // ================= 하체 (투레그 / 원레그 & 바벨/덤벨/스미스 구분) =================
  { name: "[투레그] 바벨 백스쿼트", category: "하체", isOneArm: false },
  { name: "[투레그] 바벨 프론트스쿼트", category: "하체", isOneArm: false },
  { name: "[투레그] 스미스 머신 스쿼트", category: "하체", isOneArm: false },
  { name: "[투레그] 덤벨 스쿼트", category: "하체", isOneArm: false },
  { name: "[투레그] 레그 프레스", category: "하체", isOneArm: false },
  { name: "[투레그] 레그 익스텐션", category: "하체", isOneArm: false },
  { name: "[투레그] 레그 컬", category: "하체", isOneArm: false },
  { name: "[투레그] 바벨 루마니안 데드리프트", category: "하체", isOneArm: false },
  { name: "[투레그] 덤벨 루마니안 데드리프트", category: "하체", isOneArm: false },
  { name: "[원레그] 덤벨 런지", category: "하체", isOneArm: true },
  { name: "[원레그] 스미스 머신 런지", category: "하체", isOneArm: false },
  { name: "[원레그] 덤벨 불가지안 스플릿 스쿼트", category: "하체", isOneArm: true },
  { name: "[원레그] 원레그 레그 익스텐션", category: "하체", isOneArm: true },
  { name: "[원레그] 원레그 레그 컬", category: "하체", isOneArm: true },
  { name: "[원레그] 원레그 레그 프레스", category: "하체", isOneArm: true },

  // ================= 팔 (이두 / 삼두) =================
  { name: "바벨 트라이셉스 익스텐션", category: "삼두", isOneArm: false },
  { name: "덤벨 트라이셉스 익스텐션", category: "삼두", isOneArm: false },
  { name: "케이블 푸쉬다운", category: "삼두", isOneArm: false },
  { name: "원암 케이블 트라이셉스 익스텐션", category: "삼두", isOneArm: true },
  { name: "바벨 컬", category: "이두", isOneArm: false },
  { name: "덤벨 컬", category: "이두", isOneArm: false },
  { name: "원암 덤벨 프리처 컬", category: "이두", isOneArm: true },
  { name: "케이블 컬", category: "이두", isOneArm: false },
  { name: "원암 케이블 컬", category: "이두", isOneArm: true },
];

const DAYS = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];
const CATEGORIES = ["전체", "가슴", "등", "어깨", "후면어깨", "하체", "이두", "삼두", "원암 🦾"];

interface SetItem {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

interface ExerciseItem {
  name: string;
  category: string;
  isOneArm: boolean;
  sets: SetItem[];
}

interface DaySchedule {
  day: string;
  isRest: boolean;
  targetCategories: string[];
  exercises: { name: string; category: string; isOneArm: boolean }[];
}

interface WeeklyRoutine {
  id: string;
  name: string;
  schedule: Record<string, DaySchedule>;
}

export default function GymTracker() {
  const [activeTab, setActiveTab] = useState<"log" | "routine" | "history">("log");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("전체");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [routines, setRoutines] = useState<WeeklyRoutine[]>([
    {
      id: "1",
      name: "🔥 표준 4분할 루틴",
      schedule: {
        월요일: { day: "월요일", isRest: false, targetCategories: ["가슴", "삼두"], exercises: [{ name: "스미스 머신 벤치프레스", category: "가슴", isOneArm: false }, { name: "케이블 체스트 플라이", category: "가슴", isOneArm: false }, { name: "원암 케이블 트라이셉스 익스텐션", category: "삼두", isOneArm: true }] },
        화요일: { day: "화요일", isRest: false, targetCategories: ["등", "이두"], exercises: [{ name: "렛풀다운 (오버그립)", category: "등", isOneArm: false }, { name: "원암 덤벨로우", category: "등", isOneArm: true }, { name: "바벨 컬", category: "이두", isOneArm: false }] },
        수요일: { day: "수요일", isRest: true, targetCategories: [], exercises: [] },
        목요일: { day: "목요일", isRest: false, targetCategories: ["어깨"], exercises: [{ name: "[전면] 스미스 머신 숄더 프레스", category: "어깨", isOneArm: false }, { name: "[측면] 케이블 사이드 레이터럴 레이즈", category: "어깨", isOneArm: false }, { name: "[후면] 케이블 페이스풀", category: "후면어깨", isOneArm: false }] },
        금요일: { day: "금요일", isRest: false, targetCategories: ["하체"], exercises: [{ name: "[투레그] 바벨 백스쿼트", category: "하체", isOneArm: false }, { name: "[원레그] 덤벨 불가지안 스플릿 스쿼트", category: "하체", isOneArm: true }] },
        토요일: { day: "토요일", isRest: true, targetCategories: [], exercises: [] },
        일요일: { day: "일요일", isRest: true, targetCategories: [], exercises: [] },
      },
    },
  ]);

  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);

  const [currentWorkout, setCurrentWorkout] = useState<{
    title: string;
    exercises: ExerciseItem[];
  }>({
    title: "오늘의 운동",
    exercises: [],
  });

  const [workoutLogs, setWorkoutLogs] = useState<
    { date: string; title: string; exercises: ExerciseItem[] }[]
  >([]);

  const [newRoutineName, setNewRoutineName] = useState("");
  const [editingSchedule, setEditingSchedule] = useState<Record<string, DaySchedule>>(
    DAYS.reduce((acc, day) => {
      acc[day] = { day, isRest: false, targetCategories: [], exercises: [] };
      return acc;
    }, {} as Record<string, DaySchedule>)
  );

  const toggleRestDay = (day: string) => {
    setEditingSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isRest: !prev[day].isRest,
        exercises: !prev[day].isRest ? [] : prev[day].exercises,
      },
    }));
  };

  const addExerciseToScheduleDay = (day: string, exName: string) => {
    const found = EXERCISE_DATABASE.find((e) => e.name === exName);
    if (!found) return;

    setEditingSchedule((prev) => {
      const currentDay = prev[day];
      return {
        ...prev,
        [day]: {
          ...currentDay,
          exercises: [...currentDay.exercises, { name: found.name, category: found.category, isOneArm: found.isOneArm }],
        },
      };
    });
  };

  const removeExerciseFromScheduleDay = (day: string, exIdx: number) => {
    setEditingSchedule((prev) => {
      const currentDay = prev[day];
      const updatedExercises = [...currentDay.exercises];
      updatedExercises.splice(exIdx, 1);
      return {
        ...prev,
        [day]: {
          ...currentDay,
          exercises: updatedExercises,
        },
      };
    });
  };

  const startEditRoutine = (routine: WeeklyRoutine) => {
    setEditingRoutineId(routine.id);
    setNewRoutineName(routine.name);
    setEditingSchedule(JSON.parse(JSON.stringify(routine.schedule)));
  };

  const cancelEditRoutine = () => {
    setEditingRoutineId(null);
    setNewRoutineName("");
    setEditingSchedule(
      DAYS.reduce((acc, day) => {
        acc[day] = { day, isRest: false, targetCategories: [], exercises: [] };
        return acc;
      }, {} as Record<string, DaySchedule>)
    );
  };

  const saveWeeklyRoutine = () => {
    if (!newRoutineName.trim()) {
      alert("루틴 이름을 입력해주세요.");
      return;
    }

    if (editingRoutineId) {
      setRoutines((prev) =>
        prev.map((r) =>
          r.id === editingRoutineId
            ? { ...r, name: newRoutineName, schedule: editingSchedule }
            : r
        )
      );
      alert(`'${newRoutineName}' 루틴이 수정되었습니다!`);
    } else {
      const created: WeeklyRoutine = {
        id: Date.now().toString(),
        name: newRoutineName,
        schedule: editingSchedule,
      };
      setRoutines([...routines, created]);
      alert(`'${newRoutineName}' 루틴이 저장되었습니다!`);
    }

    cancelEditRoutine();
  };

  const deleteRoutine = (id: string) => {
    if (confirm("해당 루틴을 삭제하시겠습니까?")) {
      setRoutines((prev) => prev.filter((r) => r.id !== id));
      if (editingRoutineId === id) cancelEditRoutine();
    }
  };

  const loadRoutineToLog = (routine: WeeklyRoutine) => {
    const dayOfWeek = new Date(selectedDate).toLocaleDateString("ko-KR", { weekday: "long" });
    const todaySchedule = routine.schedule[dayOfWeek] || routine.schedule["월요일"];

    if (todaySchedule.isRest) {
      alert(`선택한 날짜(${selectedDate}, ${dayOfWeek})는 '${routine.name}' 기준 [휴식일]입니다!`);
      return;
    }

    const loaded: ExerciseItem[] = todaySchedule.exercises.map((ex) => ({
      name: ex.name,
      category: ex.category,
      isOneArm: ex.isOneArm,
      sets: [
        { setNumber: 1, weight: 0, reps: 10, completed: false },
        { setNumber: 2, weight: 0, reps: 10, completed: false },
        { setNumber: 3, weight: 0, reps: 10, completed: false },
      ],
    }));

    setCurrentWorkout({
      title: `${routine.name} - ${dayOfWeek} 운동`,
      exercises: loaded,
    });

    setActiveTab("log");
    alert(`'${routine.name}'의 [${dayOfWeek}] 운동을 불러왔습니다!`);
  };

  const addExerciseToWorkout = (exName: string) => {
    const found = EXERCISE_DATABASE.find((e) => e.name === exName);
    if (!found) return;

    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          name: found.name,
          category: found.category,
          isOneArm: found.isOneArm,
          sets: [
            { setNumber: 1, weight: 0, reps: 10, completed: false },
            { setNumber: 2, weight: 0, reps: 10, completed: false },
            { setNumber: 3, weight: 0, reps: 10, completed: false },
          ],
        },
      ],
    }));
  };

  const updateSet = (exIdx: number, setIdx: number, field: keyof SetItem, val: number | boolean) => {
    setCurrentWorkout((prev) => {
      const updated = [...prev.exercises];
      const targetSets = [...updated[exIdx].sets];
      targetSets[setIdx] = { ...targetSets[setIdx], [field]: val };
      updated[exIdx].sets = targetSets;
      return { ...prev, exercises: updated };
    });
  };

  const saveWorkoutLog = () => {
    if (currentWorkout.exercises.length === 0) return;
    setWorkoutLogs([{ date: selectedDate, title: currentWorkout.title, exercises: currentWorkout.exercises }, ...workoutLogs]);
    alert("운동 기록이 저장되었습니다!");
    setCurrentWorkout({ title: "오늘의 운동", exercises: [] });
  };

  const filteredExercises = EXERCISE_DATABASE.filter((ex) => {
    if (selectedCategoryTab === "전체") return true;
    if (selectedCategoryTab === "원암 🦾") return ex.isOneArm;
    return ex.category === selectedCategoryTab;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">⚡ GYM TRACKER</h1>
          <p className="text-xs text-slate-400">주간 스케줄 분할 & 세분화된 운동 라이브러리</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded px-3 py-1.5"
        />
      </header>

      <nav className="flex bg-slate-900 rounded-lg p-1 mb-6 border border-slate-800">
        <button
          onClick={() => setActiveTab("log")}
          className={`flex-1 py-2 text-sm font-semibold rounded-md ${
            activeTab === "log" ? "bg-blue-600 text-white" : "text-slate-400"
          }`}
        >
          🏋️ 운동 기록
        </button>
        <button
          onClick={() => setActiveTab("routine")}
          className={`flex-1 py-2 text-sm font-semibold rounded-md ${
            activeTab === "routine" ? "bg-blue-600 text-white" : "text-slate-400"
          }`}
        >
          📋 주간 루틴 설정 ({routines.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 text-sm font-semibold rounded-md ${
            activeTab === "history" ? "bg-blue-600 text-white" : "text-slate-400"
          }`}
        >
          📅 기록 보관함 ({workoutLogs.length})
        </button>
      </nav>

      {activeTab === "log" && (
        <section className="space-y-6">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-semibold text-slate-400">⚡ 내 루틴 스케줄 불러오기</h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {routines.map((r) => (
                <button
                  key={r.id}
                  onClick={() => loadRoutineToLog(r)}
                  className="bg-slate-800 hover:bg-blue-900/50 border border-slate-700 text-xs px-3 py-2 rounded-lg text-left whitespace-nowrap"
                >
                  <div className="font-bold text-slate-200">{r.name}</div>
                  <div className="text-[10px] text-blue-400">오늘 요일 자동 적용 ➔</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">🔍 부위별 운동 라이브러리</h3>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryTab(cat)}
                  className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap transition-all ${
                    selectedCategoryTab === cat ? "bg-blue-600 text-white font-bold" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              onChange={(e) => {
                if (e.target.value) {
                  addExerciseToWorkout(e.target.value);
                  e.target.value = "";
                }
              }}
              className="w-full bg-slate-800 border border-slate-700 text-sm text-slate-200 rounded-lg p-2.5"
            >
              <option value="">-- [{selectedCategoryTab}] 종목 선택 및 기록 추가 --</option>
              {filteredExercises.map((ex, idx) => (
                <option key={idx} value={ex.name}>
                  [{ex.category}] {ex.name} {ex.isOneArm ? "(원암/단독 🦾)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {currentWorkout.exercises.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                루틴을 불러오거나 부위별 종목을 선택해 세트를 기록하세요.
              </div>
            ) : (
              currentWorkout.exercises.map((ex, exIdx) => (
                <div key={exIdx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-900/60 text-blue-300 text-xs font-bold px-2 py-0.5 rounded">
                        {ex.category}
                      </span>
                      <h4 className="font-bold text-slate-100">{ex.name}</h4>
                      {ex.isOneArm && <span className="text-amber-400 text-xs">🦾 원암</span>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ex.sets.map((s, setIdx) => (
                      <div key={setIdx} className="grid grid-cols-12 gap-2 items-center">
                        <span className="col-span-2 text-center text-xs text-slate-400">{s.setNumber}세트</span>
                        <input
                          type="number"
                          value={s.weight}
                          onChange={(e) => updateSet(exIdx, setIdx, "weight", Number(e.target.value))}
                          className="col-span-4 bg-slate-800 text-center text-sm rounded border border-slate-700 p-1"
                        />
                        <input
                          type="number"
                          value={s.reps}
                          onChange={(e) => updateSet(exIdx, setIdx, "reps", Number(e.target.value))}
                          className="col-span-4 bg-slate-800 text-center text-sm rounded border border-slate-700 p-1"
                        />
                        <button
                          onClick={() => updateSet(exIdx, setIdx, "completed", !s.completed)}
                          className={`col-span-2 py-1 rounded text-xs font-bold ${
                            s.completed ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {s.completed ? "✓" : "-"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {currentWorkout.exercises.length > 0 && (
            <button
              onClick={saveWorkoutLog}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl shadow-lg"
            >
              💾 오늘 운동 완료 및 기록 저장
            </button>
          )}
        </section>
      )}

      {activeTab === "routine" && (
        <section className="space-y-6">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-200">
                {editingRoutineId ? "✏️ 루틴 수정하기" : "🗓️ 새 주간 분할 루틴 만들기"}
              </h3>
              {editingRoutineId && (
                <button
                  onClick={cancelEditRoutine}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  취소 및 신규 작성
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="루틴 이름 (예: 3분할 PPL, 상하체 2분할, 5분할 등)"
              value={newRoutineName}
              onChange={(e) => setNewRoutineName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100"
            />

            <div className="space-y-3">
              {DAYS.map((day) => {
                const dayConfig = editingSchedule[day];
                return (
                  <div key={day} className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-200">{day}</span>
                      <button
                        onClick={() => toggleRestDay(day)}
                        className={`text-xs px-2.5 py-1 rounded font-bold transition-all ${
                          dayConfig.isRest ? "bg-red-900/60 text-red-300 border border-red-700" : "bg-emerald-900/60 text-emerald-300 border border-emerald-700"
                        }`}
                      >
                        {dayConfig.isRest ? "💤 휴식일 (Rest)" : "🏋️ 운동일 (Workout)"}
                      </button>
                    </div>

                    {!dayConfig.isRest && (
                      <div className="space-y-2">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              addExerciseToScheduleDay(day, e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded p-1.5"
                        >
                          <option value="">+ {day}에 할 운동 추가</option>
                          {EXERCISE_DATABASE.map((ex, idx) => (
                            <option key={idx} value={ex.name}>
                              [{ex.category}] {ex.name} {ex.isOneArm ? "(원암)" : ""}
                            </option>
                          ))}
                        </select>

                        {dayConfig.exercises.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {dayConfig.exercises.map((ex, eIdx) => (
                              <span key={eIdx} className="bg-slate-900 text-xs text-blue-300 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                                {ex.name}
                                <button
                                  onClick={() => removeExerciseFromScheduleDay(day, eIdx)}
                                  className="text-red-400 hover:text-red-300 font-bold ml-1 text-[10px]"
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={saveWeeklyRoutine}
              className={`w-full py-3 font-bold rounded-lg text-sm text-white ${
                editingRoutineId ? "bg-emerald-600 hover:bg-emerald-500" : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {editingRoutineId ? "💾 수정사항 저장 완료" : "💾 주간 루틴 생성 완료"}
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400">저장된 주간 루틴 목록 ({routines.length})</h3>
            {routines.map((r) => (
              <div key={r.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-slate-100">{r.name}</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditRoutine(r)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded font-bold border border-slate-700"
                    >
                      ✏️ 수정
                    </button>
                    <button
                      onClick={() => deleteRoutine(r.id)}
                      className="bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs px-2.5 py-1 rounded font-bold border border-red-800"
                    >
                      🗑️ 삭제
                    </button>
                    <button
                      onClick={() => loadRoutineToLog(r)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded-lg font-bold"
                    >
                      기록에 적용 ➔
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-[11px] text-center">
                  {DAYS.map((day) => {
                    const sched = r.schedule[day];
                    return (
                      <div key={day} className={`p-1.5 rounded ${sched?.isRest ? "bg-slate-800/40 text-slate-500" : "bg-blue-950/40 text-blue-300 font-semibold"}`}>
                        <div>{day.replace("요일", "")}</div>
                        <div className="text-[9px] mt-0.5">{sched?.isRest ? "휴식" : `${sched?.exercises.length || 0}개`}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "history" && (
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400">저장된 운동 기록</h3>
          {workoutLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
              저장된 기록이 없습니다.
            </div>
          ) : (
            workoutLogs.map((log, idx) => (
              <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">{log.date}</span>
                  <span className="font-bold text-sm text-slate-200">{log.title}</span>
                </div>
                {log.exercises.map((ex, eIdx) => (
                  <div key={eIdx} className="text-xs text-slate-400">
                    [{ex.category}] {ex.name} - {ex.sets.length}세트 완료
                  </div>
                ))}
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
}