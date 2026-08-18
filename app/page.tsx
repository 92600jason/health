"use client";

import React, { useState, useEffect } from "react";

// 기본 운동 DB (복근 / 코어 / 어시스트 풀업 포함)
const EXERCISE_DATABASE = [
  // 가슴
  { name: "바벨 벤치프레스", category: "가슴", isOneArm: false },
  { name: "덤벨 벤치프레스", category: "가슴", isOneArm: false },
  { name: "스미스 머신 벤치프레스", category: "가슴", isOneArm: false },
  { name: "바벨 인클라인 벤치프레스", category: "가슴", isOneArm: false },
  { name: "덤벨 인클라인 벤치프레스", category: "가슴", isOneArm: false },
  { name: "케이블 체스트 플라이", category: "가슴", isOneArm: false },
  { name: "딥스", category: "가슴", isOneArm: false },

  // 등
  { name: "풀업 (맨몸 턱걸이)", category: "등", isOneArm: false },
  { name: "어시스트 풀업 (머신 보조)", category: "등", isOneArm: false },
  { name: "렛풀다운 (오버그립)", category: "등", isOneArm: false },
  { name: "렛풀다운 (언더그립)", category: "등", isOneArm: false },
  { name: "클로즈그립 렛풀다운", category: "등", isOneArm: false },
  { name: "원암 케이블 렛풀다운", category: "등", isOneArm: true },
  { name: "바벨로우", category: "등", isOneArm: false },
  { name: "덤벨로우", category: "등", isOneArm: false },
  { name: "원암 덤벨로우", category: "등", isOneArm: true },
  { name: "시티드 케이블로우", category: "등", isOneArm: false },
  { name: "컨벤셔널 데드리프트", category: "등", isOneArm: false },

  // 어깨
  { name: "[전면] 바벨 오버헤드 프레스", category: "어깨", isOneArm: false },
  { name: "[전면] 덤벨 숄더 프레스", category: "어깨", isOneArm: false },
  { name: "[측면] 덤벨 사이드 레이터럴 레이즈", category: "어깨", isOneArm: false },
  { name: "[측면] 케이블 사이드 레이터럴 레이즈", category: "어깨", isOneArm: false },
  { name: "[후면] 덤벨 리버스 플라이", category: "후면어깨", isOneArm: false },
  { name: "[후면] 케이블 페이스풀", category: "후면어깨", isOneArm: false },

  // 하체
  { name: "[투레그] 바벨 백스쿼트", category: "하체", isOneArm: false },
  { name: "[투레그] 레그 프레스", category: "하체", isOneArm: false },
  { name: "[투레그] 레그 익스텐션", category: "하체", isOneArm: false },
  { name: "[투레그] 레그 컬", category: "하체", isOneArm: false },
  { name: "[원레그] 덤벨 런지", category: "하체", isOneArm: true },

  // 복근 / 코어
  { name: "플랭크", category: "복근", isOneArm: false },
  { name: "행잉 레그 레이즈", category: "복근", isOneArm: false },
  { name: "크런치", category: "복근", isOneArm: false },
  { name: "바이시클 크런치", category: "복근", isOneArm: false },
  { name: "AB 슬라이드 (아브휠)", category: "복근", isOneArm: false },
  { name: "케이블 우드칩", category: "복근", isOneArm: false },

  // 팔
  { name: "바벨 트라이셉스 익스텐션", category: "삼두", isOneArm: false },
  { name: "케이블 푸쉬다운", category: "삼두", isOneArm: false },
  { name: "바벨 컬", category: "이두", isOneArm: false },
  { name: "덤벨 컬", category: "이두", isOneArm: false },
];

const DAYS = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];
const CATEGORIES = ["전체", "가슴", "등", "어깨", "후면어깨", "하체", "복근", "이두", "삼두", "원암 🦾"];

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

  const [routines, setRoutines] = useState<WeeklyRoutine[]>([]);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false); // 로딩 플래그

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

  // 1. 처음 들어왔을 때 저장된 기존 루틴 데이터 안전하게 불러오기
  useEffect(() => {
    const savedRoutines = localStorage.getItem("gym_routines");
    const savedLogs = localStorage.getItem("gym_logs");

    if (savedRoutines) {
      try {
        const parsed = JSON.parse(savedRoutines);
        if (Array.isArray(parsed)) {
          setRoutines(parsed);
        }
      } catch (e) {
        console.error("루틴 불러오기 오류", e);
      }
    }

    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs);
        if (Array.isArray(parsedLogs)) {
          setWorkoutLogs(parsedLogs);
        }
      } catch (e) {
        console.error("기록 불러오기 오류", e);
      }
    }

    setIsLoaded(true); // 데이터 로드 완료
  }, []);

  // 2. 루틴 데이터 변경 시에만 localStorage 업데이트 (불러오기 완료 이후에만 실행)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gym_routines", JSON.stringify(routines));
    }
  }, [routines, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("gym_logs", JSON.stringify(workoutLogs));
    }
  }, [workoutLogs, isLoaded]);

  // 이전 세트 기록 자동 기억 불러오기
  const getLastSetData = (exerciseName: string): SetItem[] => {
    for (const log of workoutLogs) {
      const foundEx = log.exercises.find((e) => e.name === exerciseName);
      if (foundEx && foundEx.sets && foundEx.sets.length > 0) {
        return foundEx.sets.map((s) => ({
          ...s,
          completed: false,
        }));
      }
    }
    return [
      { setNumber: 1, weight: 0, reps: 10, completed: false },
      { setNumber: 2, weight: 0, reps: 10, completed: false },
      { setNumber: 3, weight: 0, reps: 10, completed: false },
    ];
  };

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
      alert(`'${newRoutineName}' 루틴이 수정되었습니다.`);
    } else {
      const created: WeeklyRoutine = {
        id: Date.now().toString(),
        name: newRoutineName,
        schedule: editingSchedule,
      };
      setRoutines((prev) => [...prev, created]);
      alert(`'${newRoutineName}' 루틴이 추가되었습니다.`);
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
      alert(`선택한 날짜(${selectedDate}, ${dayOfWeek})는 '${routine.name}' 기준 [휴식일]입니다.`);
      return;
    }

    const loaded: ExerciseItem[] = todaySchedule.exercises.map((ex) => ({
      name: ex.name,
      category: ex.category,
      isOneArm: ex.isOneArm,
      sets: getLastSetData(ex.name),
    }));

    setCurrentWorkout({
      title: `${routine.name} - ${dayOfWeek}`,
      exercises: loaded,
    });

    setActiveTab("log");
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
          sets: getLastSetData(found.name),
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

  const addSetToExercise = (exIdx: number) => {
    setCurrentWorkout((prev) => {
      const updated = [...prev.exercises];
      const targetSets = updated[exIdx].sets;
      const lastSet = targetSets[targetSets.length - 1] || { weight: 0, reps: 10 };
      updated[exIdx].sets = [
        ...targetSets,
        {
          setNumber: targetSets.length + 1,
          weight: lastSet.weight,
          reps: lastSet.reps,
          completed: false,
        },
      ];
      return { ...prev, exercises: updated };
    });
  };

  const saveWorkoutLog = () => {
    if (currentWorkout.exercises.length === 0) return;
    setWorkoutLogs((prev) => [
      { date: selectedDate, title: currentWorkout.title, exercises: currentWorkout.exercises },
      ...prev,
    ]);
    alert("오늘 운동 기록이 저장되었습니다!");
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
          <p className="text-xs text-slate-400">루틴 유지 & 무게/횟수 자동 기억 앱</p>
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
          📋 루틴 목록 ({routines.length})
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
            <h3 className="text-xs font-semibold text-slate-400">⚡ 내 루틴 불러오기</h3>
            {routines.length === 0 ? (
              <p className="text-xs text-slate-500 py-1">[루틴 설정] 탭에서 루틴을 등록해주세요.</p>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {routines.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => loadRoutineToLog(r)}
                    className="bg-slate-800 hover:bg-blue-900/50 border border-slate-700 text-xs px-3 py-2 rounded-lg text-left whitespace-nowrap"
                  >
                    <div className="font-bold text-slate-200">{r.name}</div>
                    <div className="text-[10px] text-blue-400">오늘 요일 루틴 불러오기 ➔</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">🔍 개별 종목 추가 (이전 무게/횟수 자동입력)</h3>
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
              <option value="">-- 종목 선택 --</option>
              {filteredExercises.map((ex, idx) => (
                <option key={idx} value={ex.name}>
                  [{ex.category}] {ex.name} {ex.isOneArm ? "(원암)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {currentWorkout.exercises.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                루틴을 선택하거나 종목을 직접 추가해 세트를 진행하세요.
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
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 text-[10px] text-slate-400 text-center font-bold">
                      <span className="col-span-2">세트</span>
                      <span className="col-span-4">무게 (kg/보조)</span>
                      <span className="col-span-4">횟수</span>
                      <span className="col-span-2">완료</span>
                    </div>

                    {ex.sets.map((s, setIdx) => (
                      <div key={setIdx} className="grid grid-cols-12 gap-2 items-center">
                        <span className="col-span-2 text-center text-xs text-slate-400">{s.setNumber}세트</span>
                        <input
                          type="number"
                          value={s.weight}
                          onChange={(e) => updateSet(exIdx, setIdx, "weight", Number(e.target.value))}
                          className="col-span-4 bg-slate-800 text-center text-sm rounded border border-slate-700 p-1 font-semibold text-blue-400"
                        />
                        <input
                          type="number"
                          value={s.reps}
                          onChange={(e) => updateSet(exIdx, setIdx, "reps", Number(e.target.value))}
                          className="col-span-4 bg-slate-800 text-center text-sm rounded border border-slate-700 p-1 font-semibold text-blue-400"
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
                    <button
                      onClick={() => addSetToExercise(exIdx)}
                      className="w-full py-1 text-xs text-slate-400 bg-slate-800/50 hover:bg-slate-800 rounded border border-dashed border-slate-700 mt-1"
                    >
                      + 세트 추가
                    </button>
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
                {editingRoutineId ? "✏️ 루틴 수정하기" : "🗓️ 새 루틴 만들기"}
              </h3>
              {editingRoutineId && (
                <button
                  onClick={cancelEditRoutine}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  취소
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="루틴 이름 (예: 내 맞춤 3분할, 복근+상체 루틴 등)"
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
                        className={`text-xs px-2.5 py-1 rounded font-bold ${
                          dayConfig.isRest ? "bg-red-900/60 text-red-300 border border-red-700" : "bg-emerald-900/60 text-emerald-300 border border-emerald-700"
                        }`}
                      >
                        {dayConfig.isRest ? "💤 휴식일" : "🏋️ 운동일"}
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
                          <option value="">+ {day} 운동 추가</option>
                          {EXERCISE_DATABASE.map((ex, idx) => (
                            <option key={idx} value={ex.name}>
                              [{ex.category}] {ex.name}
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
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-lg text-sm text-white"
            >
              {editingRoutineId ? "💾 수정완료 및 저장" : "💾 새 루틴 저장"}
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400">저장된 루틴 목록 ({routines.length})</h3>
            {routines.map((r) => (
              <div key={r.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-slate-100">{r.name}</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditRoutine(r)}
                      className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded font-bold border border-slate-700"
                    >
                      ✏️ 수정
                    </button>
                    <button
                      onClick={() => deleteRoutine(r.id)}
                      className="bg-red-950/60 text-red-300 text-xs px-2.5 py-1 rounded font-bold border border-red-800"
                    >
                      🗑️ 삭제
                    </button>
                    <button
                      onClick={() => loadRoutineToLog(r)}
                      className="bg-blue-600 text-white text-xs px-3 py-1 rounded-lg font-bold"
                    >
                      불러오기 ➔
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "history" && (
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400">운동 기록</h3>
          {workoutLogs.map((log, idx) => (
            <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">{log.date}</span>
                <span className="font-bold text-sm text-slate-200">{log.title}</span>
              </div>
              {log.exercises.map((ex, eIdx) => (
                <div key={eIdx} className="text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-blue-400">[{ex.category}] {ex.name}</div>
                  <div className="pl-2 text-slate-400 text-[11px]">
                    {ex.sets.map((s) => `${s.setNumber}세트: ${s.weight}kg x ${s.reps}회`).join(" | ")}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}