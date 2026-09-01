"use client";

import React, { useState, useEffect } from "react";

export type ExerciseType = "weight" | "bodyweight" | "cardio";

export interface ExerciseDef {
  id: string;
  name: string;
  category: string;
  isOneArm: boolean;
  type: ExerciseType;
  isCustom?: boolean;
}

// ─── 대폭 확장된 기본 운동 DATABASE ───
const INITIAL_EXERCISE_DATABASE: ExerciseDef[] = [
  // 가슴
  { id: "ex_1", name: "바벨 벤치프레스", category: "가슴", isOneArm: false, type: "weight" },
  { id: "ex_2", name: "덤벨 벤치프레스", category: "가슴", isOneArm: false, type: "weight" },
  { id: "ex_3", name: "스미스 머신 벤치프레스", category: "가슴", isOneArm: false, type: "weight" },
  { id: "ex_4", name: "체스트 프레스 머신", category: "가슴", isOneArm: false, type: "weight" },
  { id: "ex_5", name: "바벨 인클라인 벤치프레스", category: "가슴", isOneArm: false, type: "weight" },
  { id: "ex_6", name: "덤벨 인클라인 벤치프레스", category: "가슴", isOneArm: false, type: "weight" },
  { id: "ex_7", name: "인클라인 체스트 프레스 머신", category: "가슴", isOneArm: false, type: "weight" },
  { id: "ex_8", name: "덤벨 디클라인 벤치프레스", category: "가슴", isOneArm: false, type: "weight" },
  { id: "ex_9", name: "덤벨 체스트 플라이", category: "가슴", isOneArm: false, type: "weight" },
  { id: "ex_10", name: "펙덱 플라이 머신", category: "가슴", isOneArm: false, type: "weight" },
  { id: "ex_11", name: "케이블 체스트 플라이", category: "가슴", isOneArm: false, type: "weight" },
  { id: "ex_12", name: "케이블 하이투로우 플라이", category: "가슴", isOneArm: false, type: "weight" },
  { id: "ex_13", name: "케이블 로우투하이 플라이", category: "가슴", isOneArm: false, type: "weight" },
  { id: "ex_14", name: "딥스 (가슴 자극)", category: "가슴", isOneArm: false, type: "bodyweight" },
  { name: "푸쉬업 (팔굽혀펴기)", category: "가슴", isOneArm: false, type: "bodyweight", id: "ex_15" },

  // 등
  { id: "ex_16", name: "풀업 (맨몸 턱걸이)", category: "등", isOneArm: false, type: "bodyweight" },
  { id: "ex_17", name: "어시스트 풀업 머신", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_18", name: "렛풀다운 (오버그립)", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_19", name: "렛풀다운 (언더그립)", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_20", name: "클로즈그립 렛풀다운", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_21", name: "와이드그립 렛풀다운", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_22", name: "컨벤셔널 데드리프트", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_23", name: "루마니안 데드리프트", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_24", name: "렉풀 (Rack Pull)", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_25", name: "바벨로우", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_26", name: "펜들레이 로우", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_27", name: "덤벨로우", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_28", name: "원암 덤벨로우", category: "등", isOneArm: true, type: "weight" },
  { id: "ex_29", name: "시티드 케이블로우 (V바)", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_30", name: "시티드 케이블로우 (와이드바)", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_31", name: "T바 로우", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_32", name: "암 풀다운 (케이블)", category: "등", isOneArm: false, type: "weight" },
  { id: "ex_33", name: "백 익스텐션", category: "등", isOneArm: false, type: "bodyweight" },

  // 어깨 & 후면어깨
  { id: "ex_34", name: "[전면] 바벨 오버헤드 프레스 (OHP)", category: "어깨", isOneArm: false, type: "weight" },
  { id: "ex_35", name: "[전면] 스미스 머신 숄더 프레스", category: "어깨", isOneArm: false, type: "weight" },
  { id: "ex_36", name: "[전면] 덤벨 숄더 프레스", category: "어깨", isOneArm: false, type: "weight" },
  { id: "ex_37", name: "[전면] 아놀드 프레스", category: "어깨", isOneArm: false, type: "weight" },
  { id: "ex_38", name: "[전면] 숄더 프레스 머신", category: "어깨", isOneArm: false, type: "weight" },
  { id: "ex_39", name: "[측면] 덤벨 사이드 레이터럴 레이즈", category: "어깨", isOneArm: false, type: "weight" },
  { id: "ex_40", name: "[측면] 케이블 사이드 레이터럴 레이즈", category: "어깨", isOneArm: false, type: "weight" },
  { id: "ex_41", name: "[측면] 머신 사이드 레이터럴 레이즈", category: "어깨", isOneArm: false, type: "weight" },
  { id: "ex_42", name: "[측면] 업라이트 로우", category: "어깨", isOneArm: false, type: "weight" },
  { id: "ex_43", name: "[후면] 덤벨 리버스 플라이", category: "후면어깨", isOneArm: false, type: "weight" },
  { id: "ex_44", name: "[후면] 리버스 펙덱 플라이 머신", category: "후면어깨", isOneArm: false, type: "weight" },
  { id: "ex_45", name: "[후면] 케이블 페이스풀", category: "후면어깨", isOneArm: false, type: "weight" },
  { id: "ex_46", name: "[후면] 벤트오버 레이터럴 레이즈", category: "후면어깨", isOneArm: false, type: "weight" },

  // 하체
  { id: "ex_47", name: "바벨 백스쿼트", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_48", name: "바벨 프론트 스쿼트", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_49", name: "스미스 머신 스쿼트", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_50", name: "핵 스쿼트 머신", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_51", name: "덤벨 레귤러 스쿼트", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_52", name: "덤벨 와이드 스쿼트", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_53", name: "덤벨 고블렛 스쿼트", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_54", name: "레그 프레스", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_55", name: "파워 레그 프레스", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_56", name: "레그 익스텐션", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_57", name: "라잉 레그 컬", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_58", name: "시티드 레그 컬", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_59", name: "스티프 레그 데드리프트", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_60", name: "덤벨 런지", category: "하체", isOneArm: true, type: "weight" },
  { id: "ex_61", name: "불가리안 스플릿 스쿼트", category: "하체", isOneArm: true, type: "weight" },
  { id: "ex_62", name: "바벨 힙 쓰러스터", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_63", name: "이너싸이 (아웃타이/이너타이)", category: "하체", isOneArm: false, type: "weight" },
  { id: "ex_64", name: "카프 레이즈", category: "하체", isOneArm: false, type: "weight" },

  // 이두 & 삼두 & 복근
  { id: "ex_65", name: "바벨 컬", category: "이두", isOneArm: false, type: "weight" },
  { id: "ex_66", name: "EZ바 컬", category: "이두", isOneArm: false, type: "weight" },
  { id: "ex_67", name: "덤벨 컬", category: "이두", isOneArm: false, type: "weight" },
  { id: "ex_68", name: "덤벨 해머 컬", category: "이두", isOneArm: false, type: "weight" },
  { id: "ex_69", name: "인클라인 덤벨 컬", category: "이두", isOneArm: false, type: "weight" },
  { id: "ex_70", name: "프리처 컬", category: "이두", isOneArm: false, type: "weight" },
  { id: "ex_71", name: "케이블 킥백", category: "삼두", isOneArm: true, type: "weight" },
  { id: "ex_72", name: "케이블 푸쉬다운 (바)", category: "삼두", isOneArm: false, type: "weight" },
  { id: "ex_73", name: "케이블 푸쉬다운 (로프)", category: "삼두", isOneArm: false, type: "weight" },
  { id: "ex_74", name: "바벨 트라이셉스 익스텐션 (라잉)", category: "삼두", isOneArm: false, type: "weight" },
  { id: "ex_75", name: "덤벨 오버헤드 익스텐션", category: "삼두", isOneArm: false, type: "weight" },
  { id: "ex_76", name: "행잉 레그 레이즈", category: "복근", isOneArm: false, type: "bodyweight" },
  { id: "ex_77", name: "행잉 닌자 키즈", category: "복근", isOneArm: false, type: "bodyweight" },
  { id: "ex_78", name: "크런치", category: "복근", isOneArm: false, type: "bodyweight" },
  { id: "ex_79", name: "케이블 크런치", category: "복근", isOneArm: false, type: "weight" },
  { id: "ex_80", name: "플랭크", category: "복근", isOneArm: false, type: "bodyweight" },
  { id: "ex_81", name: "시티드 니업", category: "복근", isOneArm: false, type: "bodyweight" },

  // 유산소
  { id: "ex_82", name: "천국의 계단 (스텝밀)", category: "유산소", isOneArm: false, type: "cardio" },
  { id: "ex_83", name: "런닝머신 (인클라인)", category: "유산소", isOneArm: false, type: "cardio" },
  { id: "ex_84", name: "실내 자전거", category: "유산소", isOneArm: false, type: "cardio" },
  { id: "ex_85", name: "로잉 머신", category: "유산소", isOneArm: false, type: "cardio" },
  { id: "ex_86", name: "사이클 스피닝", category: "유산소", isOneArm: false, type: "cardio" },
];

const DAYS = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];
const CATEGORIES = ["전체", "가슴", "등", "어깨", "후면어깨", "하체", "복근", "이두", "삼두", "유산소", "원암 🦾"];

interface SetItem {
  setNumber: number;
  weight: number | string;
  reps: number | string;
  time: number | string;
  distance: number | string;
  completed: boolean;
}

interface ExerciseItem {
  name: string;
  category: string;
  isOneArm: boolean;
  type: ExerciseType;
  sets: SetItem[];
}

interface DaySchedule {
  day: string;
  isRest: boolean;
  exercises: { name: string; category: string; isOneArm: boolean; type: ExerciseType }[];
}

interface WeeklyRoutine {
  id: string;
  name: string;
  schedule: Record<string, DaySchedule>;
}

interface WorkoutLog {
  date: string;
  title: string;
  exercises: ExerciseItem[];
}

export default function GymTracker() {
  const [activeTab, setActiveTab] = useState<"log" | "routine" | "history">("log");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("전체");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // ─── 커스텀 운동 DB 상태 ───
  const [exerciseDb, setExerciseDb] = useState<ExerciseDef[]>(INITIAL_EXERCISE_DATABASE);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [newExName, setNewExName] = useState("");
  const [newExCategory, setNewExCategory] = useState("가슴");
  const [newExType, setNewExType] = useState<ExerciseType>("weight");
  const [newExIsOneArm, setNewExIsOneArm] = useState(false);
  const [editingExId, setEditingExId] = useState<string | null>(null);

  const [routines, setRoutines] = useState<WeeklyRoutine[]>([]);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [viewingLogDate, setViewingLogDate] = useState<string | null>(null);

  const [currentWorkout, setCurrentWorkout] = useState<{
    title: string;
    exercises: ExerciseItem[];
  }>({
    title: "오늘의 운동",
    exercises: [],
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);

  const [newRoutineName, setNewRoutineName] = useState("");
  const [editingSchedule, setEditingSchedule] = useState<Record<string, DaySchedule>>(
    DAYS.reduce((acc, day) => {
      acc[day] = { day, isRest: false, exercises: [] };
      return acc;
    }, {} as Record<string, DaySchedule>)
  );

  useEffect(() => {
    const savedDb = localStorage.getItem("gym_exercise_db");
    const savedRoutines = localStorage.getItem("gym_routines");
    const savedLogs = localStorage.getItem("gym_logs");

    if (savedDb) {
      try {
        const parsed = JSON.parse(savedDb);
        if (Array.isArray(parsed) && parsed.length > 0) setExerciseDb(parsed);
      } catch (e) {
        console.error("운동 DB 로드 오류", e);
      }
    }

    if (savedRoutines) {
      try {
        const parsed = JSON.parse(savedRoutines);
        if (Array.isArray(parsed)) setRoutines(parsed);
      } catch (e) {
        console.error("루틴 로드 오류", e);
      }
    }

    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs);
        if (Array.isArray(parsedLogs)) setWorkoutLogs(parsedLogs);
      } catch (e) {
        console.error("기록 로드 오류", e);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("gym_exercise_db", JSON.stringify(exerciseDb));
  }, [exerciseDb, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("gym_routines", JSON.stringify(routines));
  }, [routines, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("gym_logs", JSON.stringify(workoutLogs));
  }, [workoutLogs, isLoaded]);

  useEffect(() => {
    const existingLog = workoutLogs.find((l) => l.date === selectedDate);
    if (existingLog) {
      setCurrentWorkout({
        title: existingLog.title,
        exercises: JSON.parse(JSON.stringify(existingLog.exercises)),
      });
    }
  }, [selectedDate, workoutLogs]);

  // ─── 커스텀 운동 추가 / 수정 / 삭제 ───
  const handleSaveExercise = () => {
    if (!newExName.trim()) {
      alert("운동 이름을 입력해주세요.");
      return;
    }

    if (editingExId) {
      setExerciseDb((prev) =>
        prev.map((ex) =>
          ex.id === editingExId
            ? {
                ...ex,
                name: newExName,
                category: newExCategory,
                type: newExType,
                isOneArm: newExIsOneArm,
              }
            : ex
        )
      );
      alert("종목이 수정되었습니다.");
    } else {
      const created: ExerciseDef = {
        id: `custom_${Date.now()}`,
        name: newExName,
        category: newExCategory,
        type: newExType,
        isOneArm: newExIsOneArm,
        isCustom: true,
      };
      setExerciseDb((prev) => [created, ...prev]);
      alert("새 운동 종목이 추가되었습니다.");
    }

    resetExForm();
  };

  const startEditExercise = (ex: ExerciseDef) => {
    setEditingExId(ex.id);
    setNewExName(ex.name);
    setNewExCategory(ex.category);
    setNewExType(ex.type);
    setNewExIsOneArm(ex.isOneArm);
  };

  const deleteExercise = (id: string) => {
    if (confirm("정말 이 운동 종목을 삭제하시겠습니까?")) {
      setExerciseDb((prev) => prev.filter((ex) => ex.id !== id));
    }
  };

  const resetExForm = () => {
    setEditingExId(null);
    setNewExName("");
    setNewExCategory("가슴");
    setNewExType("weight");
    setNewExIsOneArm(false);
  };

  const getLastSetData = (exerciseName: string, type: ExerciseType): SetItem[] => {
    for (const log of workoutLogs) {
      const foundEx = log.exercises.find((e) => e.name === exerciseName);
      if (foundEx && foundEx.sets && foundEx.sets.length > 0) {
        return foundEx.sets.map((s) => ({
          ...s,
          completed: false,
        }));
      }
    }

    if (type === "cardio") {
      return [{ setNumber: 1, weight: "", reps: "", time: 20, distance: 2, completed: false }];
    } else if (type === "bodyweight") {
      return [
        { setNumber: 1, weight: 0, reps: 10, time: "", distance: "", completed: false },
        { setNumber: 2, weight: 0, reps: 10, time: "", distance: "", completed: false },
        { setNumber: 3, weight: 0, reps: 10, time: "", distance: "", completed: false },
      ];
    } else {
      return [
        { setNumber: 1, weight: 20, reps: 10, time: "", distance: "", completed: false },
        { setNumber: 2, weight: 20, reps: 10, time: "", distance: "", completed: false },
        { setNumber: 3, weight: 20, reps: 10, time: "", distance: "", completed: false },
      ];
    }
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
    const found = exerciseDb.find((e) => e.name === exName);
    const exerciseToAdd = found
      ? { name: found.name, category: found.category, isOneArm: found.isOneArm, type: found.type }
      : { name: exName, category: "기타", isOneArm: false, type: "weight" as ExerciseType };

    setEditingSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        exercises: [...prev[day].exercises, exerciseToAdd],
      },
    }));
  };

  const removeExerciseFromScheduleDay = (day: string, exIdx: number) => {
    setEditingSchedule((prev) => {
      const updatedExercises = [...prev[day].exercises];
      updatedExercises.splice(exIdx, 1);
      return {
        ...prev,
        [day]: { ...prev[day], exercises: updatedExercises },
      };
    });
  };

  const moveExerciseInScheduleDay = (day: string, fromIndex: number, direction: "up" | "down") => {
    setEditingSchedule((prev) => {
      const updatedExercises = [...prev[day].exercises];
      const targetIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;

      if (targetIndex < 0 || targetIndex >= updatedExercises.length) return prev;

      const temp = updatedExercises[fromIndex];
      updatedExercises[fromIndex] = updatedExercises[targetIndex];
      updatedExercises[targetIndex] = temp;

      return {
        ...prev,
        [day]: { ...prev[day], exercises: updatedExercises },
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
        acc[day] = { day, isRest: false, exercises: [] };
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
            ? { ...r, name: newRoutineName, schedule: JSON.parse(JSON.stringify(editingSchedule)) }
            : r
        )
      );
      alert(`'${newRoutineName}' 루틴 수정 완료`);
    } else {
      const created: WeeklyRoutine = {
        id: Date.now().toString(),
        name: newRoutineName,
        schedule: JSON.parse(JSON.stringify(editingSchedule)),
      };
      setRoutines((prev) => [...prev, created]);
      alert(`'${newRoutineName}' 새 루틴 저장 완료`);
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
      alert(`선택한 날짜(${selectedDate}, ${dayOfWeek})는 [휴식일]입니다.`);
      return;
    }

    const loaded: ExerciseItem[] = todaySchedule.exercises.map((ex) => ({
      name: ex.name,
      category: ex.category || "기타",
      isOneArm: ex.isOneArm || false,
      type: ex.type || "weight",
      sets: getLastSetData(ex.name, ex.type || "weight"),
    }));

    setCurrentWorkout({
      title: `${routine.name} - ${dayOfWeek}`,
      exercises: loaded,
    });

    setActiveTab("log");
  };

  const addExerciseToWorkout = (exName: string) => {
    const found = exerciseDb.find((e) => e.name === exName);
    const exerciseToAdd = found
      ? { name: found.name, category: found.category, isOneArm: found.isOneArm, type: found.type }
      : { name: exName, category: "기타", isOneArm: false, type: "weight" as ExerciseType };

    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          ...exerciseToAdd,
          sets: getLastSetData(exerciseToAdd.name, exerciseToAdd.type),
        },
      ],
    }));
  };

  const removeExerciseFromWorkout = (exIdx: number) => {
    setCurrentWorkout((prev) => {
      const updated = [...prev.exercises];
      updated.splice(exIdx, 1);
      return { ...prev, exercises: updated };
    });
  };

  const moveExerciseInWorkout = (fromIndex: number, direction: "up" | "down") => {
    setCurrentWorkout((prev) => {
      const updated = [...prev.exercises];
      const targetIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;

      if (targetIndex < 0 || targetIndex >= updated.length) return prev;

      const temp = updated[fromIndex];
      updated[fromIndex] = updated[targetIndex];
      updated[targetIndex] = temp;

      return { ...prev, exercises: updated };
    });
  };

  const updateSet = (exIdx: number, setIdx: number, field: keyof SetItem, val: string | boolean) => {
    setCurrentWorkout((prev) => {
      const updated = prev.exercises.map((ex) => ({ ...ex, sets: [...ex.sets] }));
      const targetSets = updated[exIdx].sets;

      if (field === "completed") {
        targetSets[setIdx] = { ...targetSets[setIdx], completed: Boolean(val) };
      } else {
        let cleanVal: number | string = val as string;

        if (typeof cleanVal === "string") {
          cleanVal = cleanVal.replace(/[^0-9.]/g, "");

          const parts = cleanVal.split(".");
          if (parts.length > 2) {
            cleanVal = parts[0] + "." + parts.slice(1).join("");
          }
        }

        targetSets[setIdx] = { ...targetSets[setIdx], [field]: cleanVal };
      }

      updated[exIdx].sets = targetSets;
      return { ...prev, exercises: updated };
    });
  };

  const addSetToExercise = (exIdx: number) => {
    setCurrentWorkout((prev) => {
      const updated = [...prev.exercises];
      const targetSets = updated[exIdx].sets;
      const lastSet = targetSets[targetSets.length - 1] || { weight: 0, reps: 10, time: 20, distance: 2 };
      updated[exIdx].sets = [
        ...targetSets,
        {
          setNumber: targetSets.length + 1,
          weight: lastSet.weight ?? "",
          reps: lastSet.reps ?? "",
          time: lastSet.time ?? "",
          distance: lastSet.distance ?? "",
          completed: false,
        },
      ];
      return { ...prev, exercises: updated };
    });
  };

  const deleteSetFromExercise = (exIdx: number, setIdx: number) => {
    setCurrentWorkout((prev) => {
      const updated = [...prev.exercises];
      const targetSets = [...updated[exIdx].sets];
      targetSets.splice(setIdx, 1);

      const renumberedSets = targetSets.map((s, idx) => ({
        ...s,
        setNumber: idx + 1,
      }));

      updated[exIdx].sets = renumberedSets;
      return { ...prev, exercises: updated };
    });
  };

  const saveWorkoutLog = () => {
    if (currentWorkout.exercises.length === 0) {
      alert("기록할 운동 종목이 없습니다.");
      return;
    }

    const cleanedExercises = currentWorkout.exercises.map((ex) => ({
      ...ex,
      sets: ex.sets.map((s) => ({
        ...s,
        weight: s.weight === "" ? 0 : Number(s.weight),
        reps: s.reps === "" ? 0 : Number(s.reps),
        time: s.time === "" ? 0 : Number(s.time),
        distance: s.distance === "" ? 0 : Number(s.distance),
      })),
    }));

    const newLogItem: WorkoutLog = {
      date: selectedDate,
      title: currentWorkout.title,
      exercises: cleanedExercises,
    };

    setWorkoutLogs((prev) => {
      const existingIdx = prev.findIndex((l) => l.date === selectedDate);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = newLogItem;
        return updated;
      }
      return [newLogItem, ...prev];
    });

    alert(`${selectedDate} 운동 기록이 저장되었습니다!`);
  };

  // ⭐️ 선택된 카테고리 탭에 맞게 걸러진 운동 목록 ⭐️
  const filteredExercises = exerciseDb.filter((ex) => {
    if (selectedCategoryTab === "전체") return true;
    if (selectedCategoryTab === "원암 🦾") return ex.isOneArm;
    return ex.category === selectedCategoryTab;
  });

  const renderCalendar = () => {
    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    const calendarCells = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="h-20 bg-slate-900/20 rounded-lg"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(calendarMonth + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");
      const dateKey = `${calendarYear}-${monthStr}-${dayStr}`;

      const logForDay = workoutLogs.find((l) => l.date === dateKey);

      const categoriesDone = logForDay
        ? Array.from(new Set(logForDay.exercises.map((e) => e.category)))
        : [];

      calendarCells.push(
        <div
          key={dateKey}
          onClick={() => setViewingLogDate(dateKey)}
          className={`h-20 p-1.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
            logForDay
              ? "bg-slate-800/80 border-blue-500/50 hover:border-blue-400"
              : "bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/40"
          }`}
        >
          <div className="flex justify-between items-center">
            <span
              className={`text-xs font-bold ${
                dateKey === selectedDate ? "text-blue-400 underline" : "text-slate-300"
              }`}
            >
              {day}
            </span>
            {logForDay && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
          </div>

          <div className="flex flex-wrap gap-0.5 mt-1 overflow-hidden">
            {categoriesDone.map((cat, i) => (
              <span
                key={i}
                className="bg-blue-900/80 text-blue-200 text-[9px] px-1 py-0.2 rounded font-semibold"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      );
    }

    return calendarCells;
  };

  const selectedLogDetail = workoutLogs.find((l) => l.date === viewingLogDate);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">⚡ GYM TRACKER</h1>
          <p className="text-xs text-slate-400">부위별 종목 선택 & 커스텀 운동 관리</p>
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
          📋 루틴 목록
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 text-sm font-semibold rounded-md ${
            activeTab === "history" ? "bg-blue-600 text-white" : "text-slate-400"
          }`}
        >
          📅 기록 달력
        </button>
      </nav>

      {/* 1. 운동 기록 탭 */}
      {activeTab === "log" && (
        <section className="space-y-6">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-semibold text-slate-400">⚡ 루틴에서 불러오기</h3>
            {routines.length === 0 ? (
              <p className="text-xs text-slate-500 py-1">[루틴 목록] 탭에서 먼저 루틴을 작성하세요.</p>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {routines.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => loadRoutineToLog(r)}
                    className="bg-slate-800 hover:bg-blue-900/50 border border-slate-700 text-xs px-3 py-2 rounded-lg text-left whitespace-nowrap"
                  >
                    <div className="font-bold text-slate-200">{r.name}</div>
                    <div className="text-[10px] text-blue-400">오늘 요일 종목 세팅 ➔</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 🔍 종목 추가 영역 (부위별 필터 적용) */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-300">🔍 종목 추가하기</h3>
              <button
                onClick={() => setIsManageModalOpen(true)}
                className="text-xs bg-blue-900/60 hover:bg-blue-800 text-blue-300 px-2.5 py-1 rounded border border-blue-700 font-bold"
              >
                ⚙️ 종목 직접 만들기 / 편집
              </button>
            </div>

            {/* 부위 필터 탭 */}
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

            {/* 필터링된 드롭다운 */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addExerciseToWorkout(e.target.value);
                  e.target.value = "";
                }
              }}
              className="w-full bg-slate-800 border border-slate-700 text-sm text-slate-200 rounded-lg p-2.5 font-semibold"
            >
              <option value="">
                -- [{selectedCategoryTab}] 운동 선택 ({filteredExercises.length}개) --
              </option>
              {filteredExercises.map((ex) => (
                <option key={ex.id} value={ex.name}>
                  [{ex.category}] {ex.name} {ex.isOneArm ? "(원암)" : ""} {ex.isCustom ? "★" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs text-slate-400 font-semibold">
                선택된 날짜: <span className="text-blue-400 font-bold">{selectedDate}</span>
              </span>
            </div>

            {currentWorkout.exercises.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                종목을 추가하거나 루틴을 불러와 기록을 작성하세요.
              </div>
            ) : (
              currentWorkout.exercises.map((ex, exIdx) => {
                const exType = ex.type || "weight";

                return (
                  <div key={exIdx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-0.5">
                          <button
                            disabled={exIdx === 0}
                            onClick={() => moveExerciseInWorkout(exIdx, "up")}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 px-1.5 py-0.5 rounded font-bold"
                          >
                            ▲
                          </button>
                          <button
                            disabled={exIdx === currentWorkout.exercises.length - 1}
                            onClick={() => moveExerciseInWorkout(exIdx, "down")}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 px-1.5 py-0.5 rounded font-bold"
                          >
                            ▼
                          </button>
                        </div>

                        <span className="bg-blue-900/60 text-blue-300 text-xs font-bold px-2 py-0.5 rounded">
                          {ex.category}
                        </span>
                        <h4 className="font-bold text-slate-100">{ex.name}</h4>
                      </div>
                      <button
                        onClick={() => removeExerciseFromWorkout(exIdx)}
                        className="text-xs text-red-400 hover:text-red-300 font-bold"
                      >
                        종목 삭제
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 text-[10px] text-slate-400 text-center font-bold">
                        <span className="col-span-2">세트</span>
                        {exType === "cardio" ? (
                          <>
                            <span className="col-span-4">시간 (분)</span>
                            <span className="col-span-3">거리 (km)</span>
                          </>
                        ) : exType === "bodyweight" ? (
                          <>
                            <span className="col-span-4">추가 중량(kg)</span>
                            <span className="col-span-3">횟수</span>
                          </>
                        ) : (
                          <>
                            <span className="col-span-4">무게 (kg)</span>
                            <span className="col-span-3">횟수</span>
                          </>
                        )}
                        <span className="col-span-2">완료</span>
                        <span className="col-span-1">삭제</span>
                      </div>

                      {ex.sets.map((s, setIdx) => (
                        <div key={setIdx} className="grid grid-cols-12 gap-2 items-center">
                          <span className="col-span-2 text-center text-xs text-slate-400">{s.setNumber}세트</span>

                          {exType === "cardio" ? (
                            <>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={s.time}
                                onChange={(e) => updateSet(exIdx, setIdx, "time", e.target.value)}
                                placeholder="분"
                                className="col-span-4 bg-slate-800 text-center text-sm rounded border border-slate-700 p-1 font-semibold text-blue-400"
                              />
                              <input
                                type="text"
                                inputMode="decimal"
                                value={s.distance}
                                onChange={(e) => updateSet(exIdx, setIdx, "distance", e.target.value)}
                                placeholder="km"
                                className="col-span-3 bg-slate-800 text-center text-sm rounded border border-slate-700 p-1 font-semibold text-blue-400"
                              />
                            </>
                          ) : (
                            <>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={s.weight}
                                onChange={(e) => updateSet(exIdx, setIdx, "weight", e.target.value)}
                                placeholder={exType === "bodyweight" ? "0 (맨몸)" : "무게"}
                                className="col-span-4 bg-slate-800 text-center text-sm rounded border border-slate-700 p-1 font-semibold text-blue-400"
                              />
                              <input
                                type="text"
                                inputMode="numeric"
                                value={s.reps}
                                onChange={(e) => updateSet(exIdx, setIdx, "reps", e.target.value)}
                                placeholder="회"
                                className="col-span-3 bg-slate-800 text-center text-sm rounded border border-slate-700 p-1 font-semibold text-blue-400"
                              />
                            </>
                          )}

                          <button
                            onClick={() => updateSet(exIdx, setIdx, "completed", !s.completed)}
                            className={`col-span-2 py-1 rounded text-xs font-bold ${
                              s.completed ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {s.completed ? "✓" : "-"}
                          </button>
                          <button
                            onClick={() => deleteSetFromExercise(exIdx, setIdx)}
                            className="col-span-1 text-center text-xs text-red-500 hover:text-red-400 font-bold"
                          >
                            ✕
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
                );
              })
            )}
          </div>

          {currentWorkout.exercises.length > 0 && (
            <button
              onClick={saveWorkoutLog}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl shadow-lg"
            >
              💾 {selectedDate} 운동 기록 저장
            </button>
          )}
        </section>
      )}

      {/* 2. 루틴 설정 탭 */}
      {activeTab === "routine" && (
        <section className="space-y-6">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-200">
                {editingRoutineId ? "✏️ 루틴 수정" : "🗓️ 새 루틴 구성"}
              </h3>
              {editingRoutineId && (
                <button onClick={cancelEditRoutine} className="text-xs text-slate-400 underline">
                  취소
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="루틴 이름 (예: 주 3회 상하체 분할)"
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
                          dayConfig.isRest
                            ? "bg-red-900/60 text-red-300 border border-red-700"
                            : "bg-emerald-900/60 text-emerald-300 border border-emerald-700"
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
                          <option value="">+ {day} 운동 종목 추가</option>
                          {exerciseDb.map((ex) => (
                            <option key={ex.id} value={ex.name}>
                              [{ex.category}] {ex.name}
                            </option>
                          ))}
                        </select>

                        {dayConfig.exercises.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {dayConfig.exercises.map((ex, eIdx) => (
                              <span
                                key={eIdx}
                                className="bg-slate-900 text-xs text-blue-300 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1"
                              >
                                <button
                                  disabled={eIdx === 0}
                                  onClick={() => moveExerciseInScheduleDay(day, eIdx, "up")}
                                  className="text-[9px] text-slate-400 hover:text-slate-200 disabled:opacity-30"
                                >
                                  ◀
                                </button>
                                {ex.name}
                                <button
                                  disabled={eIdx === dayConfig.exercises.length - 1}
                                  onClick={() => moveExerciseInScheduleDay(day, eIdx, "down")}
                                  className="text-[9px] text-slate-400 hover:text-slate-200 disabled:opacity-30"
                                >
                                  ▶
                                </button>
                                <button
                                  onClick={() => removeExerciseFromScheduleDay(day, eIdx)}
                                  className="text-red-400 font-bold ml-1 text-[10px]"
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
              💾 루틴 저장하기
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400">내 루틴 목록 ({routines.length})</h3>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. 기록 달력 탭 */}
      {activeTab === "history" && (
        <section className="space-y-6">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  if (calendarMonth === 0) {
                    setCalendarMonth(11);
                    setCalendarYear((prev) => prev - 1);
                  } else {
                    setCalendarMonth((prev) => prev - 1);
                  }
                }}
                className="bg-slate-800 px-3 py-1 rounded text-xs text-slate-300 font-bold"
              >
                ◀ 이전달
              </button>
              <h3 className="font-bold text-slate-100">
                {calendarYear}년 {calendarMonth + 1}월
              </h3>
              <button
                onClick={() => {
                  if (calendarMonth === 11) {
                    setCalendarMonth(0);
                    setCalendarYear((prev) => prev + 1);
                  } else {
                    setCalendarMonth((prev) => prev + 1);
                  }
                }}
                className="bg-slate-800 px-3 py-1 rounded text-xs text-slate-300 font-bold"
              >
                다음달 ▶
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
              <span className="text-red-400">일</span>
              <span>월</span>
              <span>화</span>
              <span>수</span>
              <span>목</span>
              <span>금</span>
              <span className="text-blue-400">토</span>
            </div>

            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </div>

          {viewingLogDate && (
            <div className="bg-slate-900 p-4 rounded-xl border border-blue-500/50 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="font-bold text-slate-100">
                  📅 {viewingLogDate} 운동 상세
                </h4>
                <button
                  onClick={() => {
                    setSelectedDate(viewingLogDate);
                    setActiveTab("log");
                  }}
                  className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded font-bold"
                >
                  수정하러 가기 ➔
                </button>
              </div>

              {!selectedLogDetail ? (
                <p className="text-xs text-slate-500 text-center py-4">
                  해당 날짜에 저장된 운동 기록이 없습니다.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedLogDetail.exercises.map((ex, exIdx) => {
                    const exType = ex.type || "weight";

                    return (
                      <div key={exIdx} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-900 text-blue-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                            {ex.category}
                          </span>
                          <span className="font-bold text-xs text-slate-200">{ex.name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs text-slate-300">
                          {ex.sets.map((s) => (
                            <div key={s.setNumber} className="bg-slate-900/80 p-1.5 rounded text-center">
                              <div className="text-[10px] text-slate-500">{s.setNumber}세트</div>
                              <div className="font-bold text-blue-400">
                                {exType === "cardio" ? (
                                  `${s.time || 0}분 ${s.distance ? `/ ${s.distance}km` : ""}`
                                ) : exType === "bodyweight" ? (
                                  s.weight && Number(s.weight) > 0
                                    ? `+${s.weight}kg × ${s.reps || 0}회`
                                    : `${s.reps || 0}회`
                                ) : (
                                  `${s.weight || 0}kg × ${s.reps || 0}회`
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ⚙️ 종목 관리 및 커스텀 생성 팝업 모달 */}
      {isManageModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100">🛠️ 운동 종목 관리 및 추가</h3>
              <button
                onClick={() => {
                  setIsManageModalOpen(false);
                  resetExForm();
                }}
                className="text-slate-400 hover:text-slate-200 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-5">
              {/* 종목 생성/수정 입력폼 */}
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-blue-400">
                  {editingExId ? "✏️ 선택한 종목 수정" : "➕ 새 커스텀 종목 생성"}
                </h4>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="운동 종목 이름 (예: 사이드 케이블 레이즈)"
                    value={newExName}
                    onChange={(e) => setNewExName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">부위(카테고리)</label>
                      <select
                        value={newExCategory}
                        onChange={(e) => setNewExCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200"
                      >
                        {CATEGORIES.filter((c) => c !== "전체" && c !== "원암 🦾").map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">운동 유형</label>
                      <select
                        value={newExType}
                        onChange={(e) => setNewExType(e.target.value as ExerciseType)}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200"
                      >
                        <option value="weight">웨이트 (무게+횟수)</option>
                        <option value="bodyweight">맨몸 (추가중량+횟수)</option>
                        <option value="cardio">유산소 (시간+거리)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="oneArmCheck"
                      checked={newExIsOneArm}
                      onChange={(e) => setNewExIsOneArm(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-blue-600"
                    />
                    <label htmlFor="oneArmCheck" className="text-xs text-slate-300">
                      원암 / 한 팔 / 한 다리 운동 여부 🦾
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSaveExercise}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 font-bold text-xs rounded text-white"
                  >
                    {editingExId ? "수정 완료" : "종목 추가 저장"}
                  </button>
                  {editingExId && (
                    <button
                      onClick={resetExForm}
                      className="px-3 py-2 bg-slate-700 text-xs font-bold rounded text-slate-300"
                    >
                      취소
                    </button>
                  )}
                </div>
              </div>

              {/* 전체 종목 데이터 리스트 (수정/삭제) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400">
                  전체 등록 종목 목록 ({exerciseDb.length}개)
                </h4>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {exerciseDb.map((ex) => (
                    <div
                      key={ex.id}
                      className="flex justify-between items-center bg-slate-800/40 border border-slate-700/50 p-2 rounded text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-900 text-blue-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
                          {ex.category}
                        </span>
                        <span className="font-semibold text-slate-200">{ex.name}</span>
                        {ex.isOneArm && <span className="text-[10px]">🦾</span>}
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditExercise(ex)}
                          className="text-[10px] bg-slate-700 text-slate-200 px-2 py-0.5 rounded font-bold"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => deleteExercise(ex.id)}
                          className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded font-bold"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}