"use client";

import React, { useState } from "react";

// 부위별 확장된 운동 데이터 베이스 (원암 및 주요 일반 운동)
const EXERCISE_DATABASE = [
  // 가슴
  { name: "벤치프레스", category: "가슴", isOneArm: false },
  { name: "인클라인 벤치프레스", category: "가슴", isOneArm: false },
  { name: "덤벨 프레스", category: "가슴", isOneArm: false },
  { name: "원암 덤벨 프레스", category: "가슴", isOneArm: true },
  { name: "체스트 플라이", category: "가슴", isOneArm: false },
  { name: "원암 케이블 체스트 플라이", category: "가슴", isOneArm: true },
  { name: "딥스", category: "가슴", isOneArm: false },

  // 등
  { name: "데드리프트", category: "등", isOneArm: false },
  { name: "렛풀다운", category: "등", isOneArm: false },
  { name: "원암 렛풀다운", category: "등", isOneArm: true },
  { name: "바벨로우", category: "등", isOneArm: false },
  { name: "원암 덤벨로우", category: "등", isOneArm: true },
  { name: "시티드 케이블로우", category: "등", isOneArm: false },
  { name: "원암 케이블로우", category: "등", isOneArm: true },
  { name: "풀업", category: "등", isOneArm: false },

  // 어깨
  { name: "오버헤드 프레스", category: "어깨", isOneArm: false },
  { name: "덤벨 숄더 프레스", category: "어깨", isOneArm: false },
  { name: "원암 덤벨 숄더 프레스", category: "어깨", isOneArm: true },
  { name: "사이드 레이터럴 레이즈", category: "어깨", isOneArm: false },
  { name: "원암 사이드 레이터럴 레이즈", category: "어깨", isOneArm: true },
  { name: "페이스 풀", category: "어깨", isOneArm: false },
  { name: "리버스 펙덱 플라이", category: "어깨", isOneArm: false },

  // 하체
  { name: "스쿼트", category: "하체", isOneArm: false },
  { name: "레그 프레스", category: "하체", isOneArm: false },
  { name: "원암/원레그 레그 익스텐션", category: "하체", isOneArm: true },
  { name: "레그 컬", category: "하체", isOneArm: false },
  { name: "런지", category: "하체", isOneArm: false },
  { name: "바벨 힙 쓰러스트", category: "하체", isOneArm: false },

  // 삼두
  { name: "바벨 트라이셉스 익스텐션", category: "삼두", isOneArm: false },
  { name: "원암 케이블 트라이셉스 익스텐션", category: "삼두", isOneArm: true },
  { name: "케이블 푸쉬다운", category: "삼두", isOneArm: false },
  { name: "원암 덤벨 오버헤드 익스텐션", category: "삼두", isOneArm: true },

  // 이두
  { name: "바벨 컬", category: "이두", isOneArm: false },
  { name: "덤벨 컬", category: "이두", isOneArm: false },
  { name: "원암 덤벨 프리처 컬", category: "이두", isOneArm: true },
  { name: "원암 케이블 컬", category: "이두", isOneArm: true },
  { name: "해머 컬", category: "이두", isOneArm: false },
];

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

interface RoutineItem {
  id: string;
  name: string;
  targetDay: string;
  exercises: { name: string; category: string; isOneArm: boolean; defaultSets: number }[];
}

export default function GymTracker() {
  const [activeTab, setActiveTab] = useState<"log" | "routine" | "history">("log");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // 저장된 루틴 목록
  const [routines, setRoutines] = useState<RoutineItem[]>([
    {
      id: "1",
      name: "가슴 & 삼두 루틴",
      targetDay: "월요일",
      exercises: [
        { name: "벤치프레스", category: "가슴", isOneArm: false, defaultSets: 4 },
        { name: "원암 케이블 체스트 플라이", category: "가슴", isOneArm: true, defaultSets: 3 },
        { name: "원암 케이블 트라이셉스 익스텐션", category: "삼두", isOneArm: true, defaultSets: 3 },
      ],
    },
    {
      id: "2",
      name: "등 & 이두 루틴",
      targetDay: "화요일",
      exercises: [
        { name: "원암 덤벨로우", category: "등", isOneArm: true, defaultSets: 4 },
        { name: "렛풀다운", category: "등", isOneArm: false, defaultSets: 4 },
        { name: "원암 덤벨 프리처 컬", category: "이두", isOneArm: true, defaultSets: 3 },
      ],
    },
  ]);

  // 현재 진행/기록 중인 운동 세션
  const [currentWorkout, setCurrentWorkout] = useState<{
    title: string;
    routineName?: string;
    exercises: ExerciseItem[];
  }>({
    title: "오늘의 운동",
    routineName: "",
    exercises: [],
  });

  // 완료되어 저장된 운동 기록 목록
  const [workoutLogs, setWorkoutLogs] = useState<
    { date: string; title: string; routineName?: string; exercises: ExerciseItem[] }[]
  >([]);

  // 루틴 생성 폼 상태
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newRoutineDay, setNewRoutineDay] = useState("월요일");
  const [selectedExercisesForRoutine, setSelectedExercisesForRoutine] = useState<
    { name: string; category: string; isOneArm: boolean; defaultSets: number }[]
  >([]);

  // 루틴을 기록으로 불러오는 핵심 함수
  const loadRoutineToLog = (routine: RoutineItem) => {
    const loadedExercises: ExerciseItem[] = routine.exercises.map((ex) => ({
      name: ex.name,
      category: ex.category,
      isOneArm: ex.isOneArm,
      sets: Array.from({ length: ex.defaultSets || 3 }, (_, index) => ({
        setNumber: index + 1,
        weight: 0,
        reps: 10,
        completed: false,
      })),
    }));

    setCurrentWorkout({
      title: `${routine.name} (${selectedDate})`,
      routineName: routine.name,
      exercises: loadedExercises,
    });

    setActiveTab("log");
    alert(`'${routine.name}'을(를) 운동 기록으로 불러왔습니다!`);
  };

  // 일반 운동 추가 함수
  const addExerciseToCurrentWorkout = (exName: string) => {
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

  // 세트 추가 / 변경 / 완료
  const updateSet = (
    exIndex: number,
    setIndex: number,
    field: keyof SetItem,
    val: number | boolean
  ) => {
    setCurrentWorkout((prev) => {
      const updatedEx = [...prev.exercises];
      const targetSets = [...updatedEx[exIndex].sets];
      targetSets[setIndex] = { ...targetSets[setIndex], [field]: val };
      updatedEx[exIndex].sets = targetSets;
      return { ...prev, exercises: updatedEx };
    });
  };

  const addSet = (exIndex: number) => {
    setCurrentWorkout((prev) => {
      const updatedEx = [...prev.exercises];
      const currentSets = updatedEx[exIndex].sets;
      const lastSet = currentSets[currentSets.length - 1] || { weight: 0, reps: 10 };
      updatedEx[exIndex].sets = [
        ...currentSets,
        {
          setNumber: currentSets.length + 1,
          weight: lastSet.weight,
          reps: lastSet.reps,
          completed: false,
        },
      ];
      return { ...prev, exercises: updatedEx };
    });
  };

  // 운동 기록 저장 완료
  const saveWorkoutLog = () => {
    if (currentWorkout.exercises.length === 0) {
      alert("추가된 운동이 없습니다. 운동을 추가한 후 저장해 주세요.");
      return;
    }

    const newLog = {
      date: selectedDate,
      title: currentWorkout.title,
      routineName: currentWorkout.routineName,
      exercises: currentWorkout.exercises,
    };

    setWorkoutLogs([newLog, ...workoutLogs]);
    alert("운동 기록이 정상적으로 저장되었습니다!");

    // 초기화
    setCurrentWorkout({
      title: "오늘의 운동",
      routineName: "",
      exercises: [],
    });
  };

  // 새 루틴 만들기
  const saveNewRoutine = () => {
    if (!newRoutineName) {
      alert("루틴 이름을 입력해주세요.");
      return;
    }
    if (selectedExercisesForRoutine.length === 0) {
      alert("최소 1개 이상의 운동을 선택해주세요.");
      return;
    }

    const created: RoutineItem = {
      id: Date.now().toString(),
      name: newRoutineName,
      targetDay: newRoutineDay,
      exercises: selectedExercisesForRoutine,
    };

    setRoutines([...routines, created]);
    setNewRoutineName("");
    setSelectedExercisesForRoutine([]);
    alert("새 루틴이 저장되었습니다!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 max-w-2xl mx-auto">
      {/* 헤더 */}
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-blue-500 flex items-center gap-2">
            ⚡ GYM TRACKER
          </h1>
          <p className="text-xs text-slate-400">원암 & 분할 루틴 완전 연동 관리</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded px-3 py-1.5"
        />
      </header>

      {/* 네비게이션 탭 */}
      <nav className="flex bg-slate-900 rounded-lg p-1 mb-6 border border-slate-800">
        <button
          onClick={() => setActiveTab("log")}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
            activeTab === "log" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🏋️ 운동 기록
        </button>
        <button
          onClick={() => setActiveTab("routine")}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
            activeTab === "routine" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          📋 루틴 관리
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
            activeTab === "history" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          📅 기록 보관함 ({workoutLogs.length})
        </button>
      </nav>

      {/* TAB 1: 운동 기록 */}
      {activeTab === "log" && (
        <section className="space-y-6">
          {/* 빠른 루틴 불러오기 배너 */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 mb-2">⚡ 생성한 루틴 불러오기</h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {routines.map((r) => (
                <button
                  key={r.id}
                  onClick={() => loadRoutineToLog(r)}
                  className="bg-slate-800 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-500 text-xs px-3 py-2 rounded-lg text-left whitespace-nowrap transition-all shrink-0"
                >
                  <div className="font-semibold text-slate-200">{r.name}</div>
                  <div className="text-[10px] text-slate-400">{r.exercises.length}개 운동 포함</div>
                </button>
              ))}
            </div>
          </div>

          {/* 운동 선택 라이브러리 */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">➕ 운동 종목 추가 (원암 & 일반)</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addExerciseToCurrentWorkout(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="w-full bg-slate-800 border border-slate-700 text-sm text-slate-200 rounded-lg p-2.5"
              >
                <option value="">-- 운동 종목을 선택하세요 --</option>
                {EXERCISE_DATABASE.map((ex, idx) => (
                  <option key={idx} value={ex.name}>
                    [{ex.category}] {ex.name} {ex.isOneArm ? "(원암 🦾)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 현재 기록 중인 운동 목록 */}
          <div className="space-y-4">
            {currentWorkout.exercises.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                상단의 [루틴 불러오기] 또는 [운동 종목 추가]를 눌러 기록을 시작하세요.
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
                      {ex.isOneArm && (
                        <span className="bg-amber-900/40 text-amber-300 text-[10px] px-1.5 py-0.5 rounded border border-amber-700/50">
                          원암 (One-Arm)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 세트 헤더 및 리스트 */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 text-xs text-slate-400 text-center px-1">
                      <span className="col-span-2">세트</span>
                      <span className="col-span-4">kg</span>
                      <span className="col-span-4">회</span>
                      <span className="col-span-2">완료</span>
                    </div>

                    {ex.sets.map((s, setIdx) => (
                      <div key={setIdx} className="grid grid-cols-12 gap-2 items-center">
                        <span className="col-span-2 text-center text-xs text-slate-400 font-bold">
                          {s.setNumber}
                        </span>
                        <input
                          type="number"
                          value={s.weight}
                          onChange={(e) => updateSet(exIdx, setIdx, "weight", Number(e.target.value))}
                          className="col-span-4 bg-slate-800 text-center text-sm rounded border border-slate-700 p-1 text-slate-100"
                        />
                        <input
                          type="number"
                          value={s.reps}
                          onChange={(e) => updateSet(exIdx, setIdx, "reps", Number(e.target.value))}
                          className="col-span-4 bg-slate-800 text-center text-sm rounded border border-slate-700 p-1 text-slate-100"
                        />
                        <button
                          onClick={() => updateSet(exIdx, setIdx, "completed", !s.completed)}
                          className={`col-span-2 py-1 rounded text-xs font-bold transition-all ${
                            s.completed ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {s.completed ? "✓" : "-"}
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addSet(exIdx)}
                    className="w-full mt-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded border border-slate-700"
                  >
                    + 세트 추가
                  </button>
                </div>
              ))
            )}
          </div>

          {currentWorkout.exercises.length > 0 && (
            <button
              onClick={saveWorkoutLog}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl shadow-lg transition-all"
            >
              💾 오늘 운동 완료 및 기록 저장
            </button>
          )}
        </section>
      )}

      {/* TAB 2: 루틴 생성 및 관리 */}
      {activeTab === "routine" && (
        <section className="space-y-6">
          {/* 새 루틴 제작 */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-200">🛠️ 나만의 분할 루틴 만들기</h3>

            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="루틴 이름 (예: 등/이두 파괴)"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                className="col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"
              />
              <select
                value={newRoutineDay}
                onChange={(e) => setNewRoutineDay(e.target.value)}
                className="col-span-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"
              >
                {["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"].map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            {/* 루틴용 종목 선택 */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400">포함할 운동 추가:</label>
              <select
                onChange={(e) => {
                  if (!e.target.value) return;
                  const item = EXERCISE_DATABASE.find((ex) => ex.name === e.target.value);
                  if (item) {
                    setSelectedExercisesForRoutine((prev) => [
                      ...prev,
                      { name: item.name, category: item.category, isOneArm: item.isOneArm, defaultSets: 3 },
                    ]);
                  }
                  e.target.value = "";
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"
              >
                <option value="">-- 클릭하여 운동 추가 --</option>
                {EXERCISE_DATABASE.map((ex, idx) => (
                  <option key={idx} value={ex.name}>
                    [{ex.category}] {ex.name} {ex.isOneArm ? "(원암 🦾)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* 선택된 운동 목록 */}
            {selectedExercisesForRoutine.length > 0 && (
              <div className="space-y-2">
                {selectedExercisesForRoutine.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-800 p-2.5 rounded-lg text-sm">
                    <span>
                      [{item.category}] <strong>{item.name}</strong> {item.isOneArm && "(원암)"}
                    </span>
                    <button
                      onClick={() =>
                        setSelectedExercisesForRoutine(selectedExercisesForRoutine.filter((_, i) => i !== idx))
                      }
                      className="text-red-400 text-xs px-2 py-1 hover:bg-slate-700 rounded"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={saveNewRoutine}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-bold rounded-lg text-sm transition-all"
            >
              저장하기
            </button>
          </div>

          {/* 루틴 목록 및 불러오기 버튼 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400">내 루틴 목록 ({routines.length})</h3>
            {routines.map((r) => (
              <div key={r.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs bg-slate-800 text-blue-400 px-2 py-0.5 rounded font-semibold mr-2">
                      {r.targetDay}
                    </span>
                    <strong className="text-slate-100">{r.name}</strong>
                  </div>
                  <button
                    onClick={() => loadRoutineToLog(r)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold"
                  >
                    기록으로 불러오기 ➔
                  </button>
                </div>
                <div className="text-xs text-slate-400 flex flex-wrap gap-1">
                  {r.exercises.map((ex, idx) => (
                    <span key={idx} className="bg-slate-800 px-2 py-1 rounded text-slate-300">
                      {ex.name} {ex.isOneArm && "🦾"}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: 기록 보관함 */}
      {activeTab === "history" && (
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400">저장된 운동 기록</h3>
          {workoutLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
              저장된 운동 기록이 없습니다.
            </div>
          ) : (
            workoutLogs.map((log, idx) => (
              <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div>
                    <span className="text-xs text-slate-400">{log.date}</span>
                    <h4 className="font-bold text-slate-100">{log.title}</h4>
                  </div>
                  {log.routineName && (
                    <span className="text-xs bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                      {log.routineName}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {log.exercises.map((ex, eIdx) => (
                    <div key={eIdx} className="text-xs text-slate-300 bg-slate-800/50 p-2 rounded">
                      <div className="font-semibold text-blue-400 mb-1">
                        [{ex.category}] {ex.name} {ex.isOneArm && "(원암)"}
                      </div>
                      <div className="text-slate-400 flex flex-wrap gap-2">
                        {ex.sets.map((s, sIdx) => (
                          <span key={sIdx} className={s.completed ? "text-emerald-400 font-semibold" : ""}>
                            {s.setNumber}세트: {s.weight}kg × {s.reps}회
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
}