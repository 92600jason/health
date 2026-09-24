"use client";

import React, { useState, useEffect } from "react";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";

// --- 타입 정의 ---
export type ExerciseType = "weight" | "bodyweight" | "cardio";
export type RoutineType = "weekday" | "cycle"; // 요일 고정형 vs 순환형

export interface ExerciseDef {
  id: string;
  name: string;
  category: string;
  equipment: string;
  unilateral?: string;
  type: ExerciseType;
}

export interface SetItem {
  id: string;
  setNumber: number;
  weight?: number;
  reps?: number;
  time?: number;
  distance?: number;
  completed: boolean;
}

export interface SelectedExercise {
  id: string;
  exerciseName: string;
  category: string;
  equipment: string;
  unilateral?: string;
  type: ExerciseType;
  sets: SetItem[];
}

export interface RoutineExercise {
  exerciseName: string;
  category: string;
  equipment: string;
  unilateral?: string;
  type: ExerciseType;
  defaultSets: number;
  defaultWeight: number;
  defaultReps: number;
}

export interface RoutineDay {
  dayName: string; // 예: "월요일" 또는 "Day 1 (가슴/삼두)"
  isRest?: boolean; // 휴식일 여부
  exercises: RoutineExercise[];
}

export interface RoutineDef {
  id: string;
  title: string;
  purpose?: string; // ★ 루틴 목적 (예: 근성장, 다이어트, 스트렝스 등)
  description: string;
  routineType: RoutineType; // "weekday" | "cycle"
  days: RoutineDay[];
}

// --- 기본 운동 목록 ---
const DEFAULT_EXERCISES: ExerciseDef[] = [
  // [가슴]
  { id: "ex-1", name: "벤치프레스", category: "가슴", equipment: "[바벨]", unilateral: "없음", type: "weight" },
  { id: "ex-2", name: "인클라인 벤치프레스", category: "가슴", equipment: "[바벨]", unilateral: "없음", type: "weight" },
  { id: "ex-3", name: "벤치프레스", category: "가슴", equipment: "[스미스]", unilateral: "없음", type: "weight" },
  { id: "ex-4", name: "인클라인 벤치프레스", category: "가슴", equipment: "[스미스]", unilateral: "없음", type: "weight" },
  { id: "ex-5", name: "덤벨 벤치프레스", category: "가슴", equipment: "[덤벨]", unilateral: "없음", type: "weight" },
  { id: "ex-6", name: "인클라인 덤벨 프레스", category: "가슴", equipment: "[덤벨]", unilateral: "없음", type: "weight" },
  { id: "ex-7", name: "덤벨 플라이", category: "가슴", equipment: "[덤벨]", unilateral: "없음", type: "weight" },
  { id: "ex-8", name: "체스트 프레스", category: "가슴", equipment: "[머신]", unilateral: "없음", type: "weight" },
  { id: "ex-9", name: "펙덱 플라이", category: "가슴", equipment: "[머신]", unilateral: "없음", type: "weight" },
  { id: "ex-10", name: "케이블 체스트 플라이", category: "가슴", equipment: "[케이블]", unilateral: "없음", type: "weight" },
  { id: "ex-11", name: "딥스", category: "가슴", equipment: "[맨몸]", unilateral: "없음", type: "bodyweight" },
  { id: "ex-12", name: "푸시업", category: "가슴", equipment: "[맨몸]", unilateral: "없음", type: "bodyweight" },

  // [등]
  { id: "ex-13", name: "컨벤셔널 데드리프트", category: "등", equipment: "[바벨]", unilateral: "없음", type: "weight" },
  { id: "ex-14", name: "바벨 로우", category: "등", equipment: "[바벨]", unilateral: "없음", type: "weight" },
  { id: "ex-15", name: "바벨 로우", category: "등", equipment: "[스미스]", unilateral: "없음", type: "weight" },
  { id: "ex-16", name: "덤벨 로우", category: "등", equipment: "[덤벨]", unilateral: "[원암]", type: "weight" },
  { id: "ex-17", name: "랫풀다운", category: "등", equipment: "[머신]", unilateral: "없음", type: "weight" },
  { id: "ex-18", name: "시티드 케이블 로우", category: "등", equipment: "[케이블]", unilateral: "없음", type: "weight" },
  { id: "ex-19", name: "케이블 암 풀다운", category: "등", equipment: "[케이블]", unilateral: "없음", type: "weight" },
  { id: "ex-20", name: "랫풀다운", category: "등", equipment: "[케이블]", unilateral: "[원암]", type: "weight" },
  { id: "ex-21", name: "T바 로우", category: "등", equipment: "[머신]", unilateral: "없음", type: "weight" },
  { id: "ex-22", name: "풀업 (턱걸이)", category: "등", equipment: "[맨몸]", unilateral: "없음", type: "bodyweight" },

  // [어깨]
  { id: "ex-23", name: "오버헤드 프레스", category: "어깨", equipment: "[바벨]", unilateral: "없음", type: "weight" },
  { id: "ex-24", name: "숄더 프레스", category: "어깨", equipment: "[스미스]", unilateral: "없음", type: "weight" },
  { id: "ex-25", name: "덤벨 숄더 프레스", category: "어깨", equipment: "[덤벨]", unilateral: "없음", type: "weight" },
  { id: "ex-26", name: "사이드 레터럴 레이즈", category: "어깨", equipment: "[덤벨]", unilateral: "없음", type: "weight" },
  { id: "ex-27", name: "사이드 레터럴 레이즈", category: "어깨", equipment: "[덤벨]", unilateral: "[원암]", type: "weight" },
  { id: "ex-28", name: "케이블 사이드 레터럴 레이즈", category: "어깨", equipment: "[케이블]", unilateral: "[원암]", type: "weight" },
  { id: "ex-29", name: "페이스 풀", category: "어깨", equipment: "[케이블]", unilateral: "없음", type: "weight" },
  { id: "ex-30", name: "리버스 펙덱 플라이", category: "어깨", equipment: "[머신]", unilateral: "없음", type: "weight" },
  { id: "ex-31", name: "케이블 후면 레이즈", category: "어깨", equipment: "[케이블]", unilateral: "[원암]", type: "weight" },
  { id: "ex-32", name: "벤트오버 덤벨 레이즈", category: "어깨", equipment: "[덤벨]", unilateral: "없음", type: "weight" },
  { id: "ex-33", name: "프론트 레이즈", category: "어깨", equipment: "[덤벨]", unilateral: "없음", type: "weight" },

  // [하체]
  { id: "ex-34", name: "백 스쿼트", category: "하체", equipment: "[바벨]", unilateral: "없음", type: "weight" },
  { id: "ex-35", name: "스쿼트", category: "하체", equipment: "[스미스]", unilateral: "없음", type: "weight" },
  { id: "ex-36", name: "레그 프레스", category: "하체", equipment: "[머신]", unilateral: "없음", type: "weight" },
  { id: "ex-37", name: "레그 익스텐션", category: "하체", equipment: "[머신]", unilateral: "없음", type: "weight" },
  { id: "ex-38", name: "라잉 레그 컬", category: "하체", equipment: "[머신]", unilateral: "없음", type: "weight" },
  { id: "ex-39", name: "덤벨 런지", category: "하체", equipment: "[덤벨]", unilateral: "[원레그]", type: "weight" },
  { id: "ex-40", name: "불가리안 스플릿 스쿼트", category: "하체", equipment: "[덤벨]", unilateral: "[원레그]", type: "weight" },
  { id: "ex-41", name: "힙 쓰러스트", category: "하체", equipment: "[바벨]", unilateral: "없음", type: "weight" },
  { id: "ex-42", name: "스쿼트", category: "하체", equipment: "[맨몸]", unilateral: "없음", type: "bodyweight" },

  // [이두]
  { id: "ex-43", name: "바벨 컬", category: "이두", equipment: "[바벨]", unilateral: "없음", type: "weight" },
  { id: "ex-44", name: "덤벨 컬", category: "이두", equipment: "[덤벨]", unilateral: "없음", type: "weight" },
  { id: "ex-45", name: "해머 컬", category: "이두", equipment: "[덤벨]", unilateral: "없음", type: "weight" },
  { id: "ex-46", name: "케이블 컬", category: "이두", equipment: "[케이블]", unilateral: "없음", type: "weight" },
  { id: "ex-47", name: "프리처 컬", category: "이두", equipment: "[머신]", unilateral: "없음", type: "weight" },

  // [삼두]
  { id: "ex-48", name: "라잉 트라이셉스 익스텐션", category: "삼두", equipment: "[바벨]", unilateral: "없음", type: "weight" },
  { id: "ex-49", name: "케이블 푸시다운", category: "삼두", equipment: "[케이블]", unilateral: "없음", type: "weight" },
  { id: "ex-50", name: "오버헤드 트라이셉스 익스텐션", category: "삼두", equipment: "[덤벨]", unilateral: "없음", type: "weight" },
  { id: "ex-51", name: "원암 트라이셉스 익스텐션", category: "삼두", equipment: "[케이블]", unilateral: "[원암]", type: "weight" },

  // [복근 & 유산소]
  { id: "ex-52", name: "행잉 레그 레이즈", category: "복근", equipment: "[맨몸]", unilateral: "없음", type: "bodyweight" },
  { id: "ex-53", name: "크런치", category: "복근", equipment: "[맨몸]", unilateral: "없음", type: "bodyweight" },
  { id: "ex-54", name: "케이블 크런치", category: "복근", equipment: "[케이블]", unilateral: "없음", type: "weight" },
  { id: "ex-55", name: "런닝머신 (트레드밀)", category: "유산소", equipment: "[유산소]", unilateral: "없음", type: "cardio" },
  { id: "ex-56", name: "실내 자전거", category: "유산소", equipment: "[유산소]", unilateral: "없음", type: "cardio" },
  { id: "ex-57", name: "천국의 계단 (스텝밀)", category: "유산소", equipment: "[유산소]", unilateral: "없음", type: "cardio" },
];

const INITIAL_ROUTINES: RoutineDef[] = [
  {
    id: "rt-1",
    title: "3분할 순환 루틴 (밀/당/하/휴)",
    purpose: "근육 비대 및 전신 균형 발달",
    description: "Day별로 순환하며 진행하는 3분할 루틴",
    routineType: "cycle",
    days: [
      {
        dayName: "Day 1 (가슴/삼두)",
        isRest: false,
        exercises: [
          { exerciseName: "벤치프레스", category: "가슴", equipment: "[바벨]", unilateral: "없음", type: "weight", defaultSets: 4, defaultWeight: 60, defaultReps: 10 },
          { exerciseName: "케이블 푸시다운", category: "삼두", equipment: "[케이블]", unilateral: "없음", type: "weight", defaultSets: 3, defaultWeight: 25, defaultReps: 12 },
        ],
      },
      {
        dayName: "Day 2 (등/이두)",
        isRest: false,
        exercises: [
          { exerciseName: "랫풀다운", category: "등", equipment: "[머신]", unilateral: "없음", type: "weight", defaultSets: 4, defaultWeight: 50, defaultReps: 10 },
          { exerciseName: "바벨 컬", category: "이두", equipment: "[바벨]", unilateral: "없음", type: "weight", defaultSets: 3, defaultWeight: 20, defaultReps: 12 },
        ],
      },
      {
        dayName: "Day 3 (하체/어깨)",
        isRest: false,
        exercises: [
          { exerciseName: "백 스쿼트", category: "하체", equipment: "[바벨]", unilateral: "없음", type: "weight", defaultSets: 4, defaultWeight: 80, defaultReps: 8 },
          { exerciseName: "덤벨 숄더 프레스", category: "어깨", equipment: "[덤벨]", unilateral: "없음", type: "weight", defaultSets: 3, defaultWeight: 16, defaultReps: 10 },
        ],
      },
      {
        dayName: "Day 4 (휴식)",
        isRest: true,
        exercises: [],
      },
    ],
  },
  {
    id: "rt-2",
    title: "주간 요일 루틴 (월/수/금)",
    purpose: "직장인/학생을 위한 주3회 건강 관리",
    description: "특정 요일에 정해진 운동을 진행하는 요일 고정형 루틴",
    routineType: "weekday",
    days: [
      {
        dayName: "월요일 (가슴/삼두)",
        isRest: false,
        exercises: [
          { exerciseName: "벤치프레스", category: "가슴", equipment: "[바벨]", unilateral: "없음", type: "weight", defaultSets: 4, defaultWeight: 60, defaultReps: 10 },
        ],
      },
      {
        dayName: "수요일 (등/이두)",
        isRest: false,
        exercises: [
          { exerciseName: "랫풀다운", category: "등", equipment: "[머신]", unilateral: "없음", type: "weight", defaultSets: 4, defaultWeight: 50, defaultReps: 10 },
        ],
      },
      {
        dayName: "금요일 (하체/어깨)",
        isRest: false,
        exercises: [
          { exerciseName: "백 스쿼트", category: "하체", equipment: "[바벨]", unilateral: "없음", type: "weight", defaultSets: 4, defaultWeight: 80, defaultReps: 8 },
        ],
      },
    ],
  },
];

interface TempRoutineDay {
  dayName: string;
  isRest: boolean;
  selectedExIds: string[];
}

const WEEKDAYS = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];

export default function GymTrackerPage() {
  const { isSignedIn, userId, isLoaded } = useAuth();

  const [activeTab, setActiveTab] = useState<"log" | "routine" | "history">("log");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");

  const [exerciseList, setExerciseList] = useState<ExerciseDef[]>(DEFAULT_EXERCISES);
  
  // 실제 저장된 데이터 (달력 표시에 사용)
  const [allLogs, setAllLogs] = useState<Record<string, SelectedExercise[]>>({});
  
  // 현재 메인 탭에서 편집 중인 임시 운동 목록
  const [workoutExercises, setWorkoutExercises] = useState<SelectedExercise[]>([]);

  const [routines, setRoutines] = useState<RoutineDef[]>(INITIAL_ROUTINES);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("완료한 운동 세트가 성공적으로 저장되었습니다!");

  // 달력 탐색 상태
  const [calYear, setCalYear] = useState<number>(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState<number>(new Date().getMonth());
  const [detailModalDate, setDetailModalDate] = useState<string | null>(null);

  // 종목 직접 만들기 모달 상태
  const [isExModalOpen, setIsExModalOpen] = useState(false);
  const [newExName, setNewExName] = useState("");
  const [newExCategory, setNewExCategory] = useState("가슴");
  const [newExEquipment, setNewExEquipment] = useState("[바벨]");
  const [newExUnilateral, setNewExUnilateral] = useState("없음");
  const [newExType, setNewExType] = useState<ExerciseType>("weight");

  // 루틴 생성 모달 상태
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [newRoutineTitle, setNewRoutineTitle] = useState("");
  const [newRoutinePurpose, setNewRoutinePurpose] = useState(""); // ★ 루틴 목적 State
  const [newRoutineDesc, setNewRoutineDesc] = useState("");
  const [newRoutineType, setNewRoutineType] = useState<RoutineType>("cycle");

  // 순환형용 임시 Day 목록
  const [cycleDays, setCycleDays] = useState<TempRoutineDay[]>([
    { dayName: "Day 1 (밀기)", isRest: false, selectedExIds: [] },
    { dayName: "Day 2 (당기기)", isRest: false, selectedExIds: [] },
    { dayName: "Day 3 (하체)", isRest: false, selectedExIds: [] },
    { dayName: "Day 4 (휴식)", isRest: true, selectedExIds: [] },
  ]);

  // 요일형용 임시 7일 목록
  const [weekdayDays, setWeekdayDays] = useState<TempRoutineDay[]>(
    WEEKDAYS.map((w) => ({ dayName: w, isRest: false, selectedExIds: [] }))
  );

  // 토스트 메시지 띄우기 함수
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedEx = localStorage.getItem("gym_exercises_v6");
      if (savedEx) setExerciseList(JSON.parse(savedEx));

      const savedRt = localStorage.getItem("gym_routines_v6");
      if (savedRt) setRoutines(JSON.parse(savedRt));

      const savedLogs = localStorage.getItem("gym_all_logs_v6");
      if (savedLogs) {
        const parsedLogs = JSON.parse(savedLogs);
        setAllLogs(parsedLogs);
        if (parsedLogs[selectedDate]) {
          setWorkoutExercises(parsedLogs[selectedDate]);
        }
      }
    } catch (e) {
      console.error("데이터 로드 에러:", e);
    }
  }, []);

  // ★ 로그인 직후 게스트 데이터 백엔드 API 연동 (Migration) 로직 추가
  useEffect(() => {
    async function migrateGuestWorkouts() {
      if (!isSignedIn || !userId) return;

      try {
        const localData = JSON.parse(localStorage.getItem("gym_all_logs_v6") || "{}");
        const hasData = Object.keys(localData).length > 0;

        if (hasData) {
          const res = await fetch("/api/workouts/migrate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ localWorkouts: localData }),
          });

          if (res.ok) {
            localStorage.removeItem("gym_all_logs_v6");
            console.log("게스트 운동 데이터가 계정에 성공적으로 통합되었습니다!");
            triggerToast("클라우드 계정과 운동 데이터가 통합되었습니다!");
          }
        }
      } catch (err) {
        console.error("데이터 이관 중 오류 발생:", err);
      }
    }

    migrateGuestWorkouts();
  }, [isSignedIn, userId]);

  // 날짜 변경 시 저장된 해당 날짜 기록 불러오기
  useEffect(() => {
    if (allLogs[selectedDate]) {
      setWorkoutExercises(JSON.parse(JSON.stringify(allLogs[selectedDate])));
    } else {
      setWorkoutExercises([]);
    }
  }, [selectedDate, allLogs]);

  // 수동 저장 버튼 클릭 시 완료 체크(completed)된 세트만 저장
  const handleManualSave = () => {
    const filteredExercises: SelectedExercise[] = workoutExercises
      .map((ex) => ({
        ...ex,
        sets: ex.sets
          .filter((s) => s.completed)
          .map((s, idx) => ({ ...s, setNumber: idx + 1 })),
      }))
      .filter((ex) => ex.sets.length > 0);

    const newAllLogs = { ...allLogs };

    if (filteredExercises.length > 0) {
      newAllLogs[selectedDate] = filteredExercises;
    } else {
      delete newAllLogs[selectedDate];
    }

    setAllLogs(newAllLogs);
    setWorkoutExercises(filteredExercises);

    if (typeof window !== "undefined") {
      localStorage.setItem("gym_all_logs_v6", JSON.stringify(newAllLogs));
    }

    triggerToast("완료한 운동 세트가 성공적으로 저장되었습니다!");
  };

  // 종목 선택 시 임시 목록에 추가
  const handleSelectExercise = (exId: string) => {
    if (!exId) return;
    const targetEx = exerciseList.find((e) => e.id === exId);
    if (!targetEx) return;

    let lastRecordedSets: SetItem[] | null = null;
    const sortedDates = Object.keys(allLogs).sort((a, b) => (a < b ? 1 : -1));

    for (const dateKey of sortedDates) {
      const dayLogs = allLogs[dateKey];
      const match = dayLogs?.find(
        (item) =>
          item.exerciseName === targetEx.name &&
          item.equipment === targetEx.equipment &&
          (item.unilateral || "없음") === (targetEx.unilateral || "없음")
      );

      if (match && match.sets && match.sets.length > 0) {
        lastRecordedSets = match.sets.map((s, idx) => ({
          id: crypto.randomUUID(),
          setNumber: idx + 1,
          weight: s.weight ?? 0,
          reps: s.reps ?? 10,
          time: s.time ?? 20,
          distance: s.distance ?? 2,
          completed: false,
        }));
        break;
      }
    }

    const defaultSets: SetItem[] = lastRecordedSets || [
      { id: crypto.randomUUID(), setNumber: 1, weight: targetEx.type === "bodyweight" ? 0 : targetEx.type === "cardio" ? 0 : 30, reps: targetEx.type === "cardio" ? 0 : 12, time: targetEx.type === "cardio" ? 20 : undefined, distance: targetEx.type === "cardio" ? 2 : undefined, completed: false },
      { id: crypto.randomUUID(), setNumber: 2, weight: targetEx.type === "bodyweight" ? 0 : targetEx.type === "cardio" ? 0 : 40, reps: targetEx.type === "cardio" ? 0 : 10, time: targetEx.type === "cardio" ? 20 : undefined, distance: targetEx.type === "cardio" ? 2 : undefined, completed: false },
      { id: crypto.randomUUID(), setNumber: 3, weight: targetEx.type === "bodyweight" ? 0 : targetEx.type === "cardio" ? 0 : 50, reps: targetEx.type === "cardio" ? 0 : 8, time: targetEx.type === "cardio" ? 20 : undefined, distance: targetEx.type === "cardio" ? 2 : undefined, completed: false },
    ];

    const newSelected: SelectedExercise = {
      id: crypto.randomUUID(),
      exerciseName: targetEx.name,
      category: targetEx.category,
      equipment: targetEx.equipment,
      unilateral: targetEx.unilateral,
      type: targetEx.type,
      sets: defaultSets,
    };

    setWorkoutExercises([...workoutExercises, newSelected]);
    setSelectedExerciseId("");
  };

  const removeExercise = (exIdx: number) => {
    const updated = [...workoutExercises];
    updated.splice(exIdx, 1);
    setWorkoutExercises(updated);
  };

  const moveExercise = (exIdx: number, direction: "up" | "down") => {
    const updated = [...workoutExercises];
    const targetIdx = direction === "up" ? exIdx - 1 : exIdx + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    const temp = updated[exIdx];
    updated[exIdx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setWorkoutExercises(updated);
  };

  const addSet = (exIdx: number) => {
    const updated = [...workoutExercises];
    const target = updated[exIdx];
    const lastSet = target.sets[target.sets.length - 1];

    target.sets.push({
      id: crypto.randomUUID(),
      setNumber: target.sets.length + 1,
      weight: lastSet?.weight ?? 0,
      reps: lastSet?.reps ?? 10,
      time: lastSet?.time ?? 20,
      distance: lastSet?.distance ?? 2,
      completed: false,
    });
    setWorkoutExercises(updated);
  };

  const removeSet = (exIdx: number, setIdx: number) => {
    const updated = [...workoutExercises];
    updated[exIdx].sets.splice(setIdx, 1);
    updated[exIdx].sets.forEach((s, i) => (s.setNumber = i + 1));
    setWorkoutExercises(updated);
  };

  const toggleSetCompleted = (exIdx: number, setIdx: number) => {
    const updated = [...workoutExercises];
    updated[exIdx].sets[setIdx].completed = !updated[exIdx].sets[setIdx].completed;
    setWorkoutExercises(updated);
  };

  const updateSetField = (
    exIdx: number,
    setIdx: number,
    field: "weight" | "reps" | "time" | "distance",
    val: number
  ) => {
    const updated = [...workoutExercises];
    updated[exIdx].sets[setIdx][field] = val;
    setWorkoutExercises(updated);
  };

  const resetLog = () => {
    if (confirm(`${selectedDate} 날짜의 저장된 기록을 모두 삭제하시겠습니까?`)) {
      const newAllLogs = { ...allLogs };
      delete newAllLogs[selectedDate];
      setAllLogs(newAllLogs);
      setWorkoutExercises([]);

      if (typeof window !== "undefined") {
        localStorage.setItem("gym_all_logs_v6", JSON.stringify(newAllLogs));
      }
    }
  };

  // 커스텀 종목 추가
  const handleCreateCustomExercise = () => {
    if (!newExName.trim()) return alert("운동 이름을 입력해주세요.");
    const customEx: ExerciseDef = {
      id: crypto.randomUUID(),
      name: newExName.trim(),
      category: newExCategory,
      equipment: newExEquipment,
      unilateral: newExUnilateral,
      type: newExType,
    };

    const updatedExList = [...exerciseList, customEx];
    setExerciseList(updatedExList);
    if (typeof window !== "undefined") {
      localStorage.setItem("gym_exercises_v6", JSON.stringify(updatedExList));
    }

    setNewExName("");
    setIsExModalOpen(false);
  };

  // 특정 루틴 Day의 운동 목록을 오늘 기록으로 가져오기
  const applyRoutineDayToToday = (day: RoutineDay) => {
    if (day.isRest) {
      alert(`'${day.dayName}'은 휴식일입니다! 충분한 휴식을 취해 주세요. ☕`);
      return;
    }

    if (day.exercises.length === 0) {
      alert("이 일차에 설정된 운동이 없습니다.");
      return;
    }

    const newExercises: SelectedExercise[] = day.exercises.map((item) => ({
      id: crypto.randomUUID(),
      exerciseName: item.exerciseName,
      category: item.category,
      equipment: item.equipment,
      unilateral: item.unilateral,
      type: item.type,
      sets: Array.from({ length: item.defaultSets }, (_, idx) => ({
        id: crypto.randomUUID(),
        setNumber: idx + 1,
        weight: item.defaultWeight,
        reps: item.defaultReps,
        time: item.type === "cardio" ? 20 : undefined,
        distance: item.type === "cardio" ? 2 : undefined,
        completed: false,
      })),
    }));

    setWorkoutExercises([...workoutExercises, ...newExercises]);
    setActiveTab("log");
    triggerToast("선택한 루틴 운동이 오늘 운동 목록에 추가되었습니다!");
  };

  // 달력의 특정 날짜 운동 기록을 '오늘 루틴'으로 불러오기
  const importCalendarLogToToday = (targetDate: string) => {
    const dayLogs = allLogs[targetDate];
    if (!dayLogs || dayLogs.length === 0) {
      alert("해당 날짜에 불러올 운동 기록이 없습니다.");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const importedExercises: SelectedExercise[] = dayLogs.map((item) => ({
      id: crypto.randomUUID(),
      exerciseName: item.exerciseName,
      category: item.category,
      equipment: item.equipment,
      unilateral: item.unilateral,
      type: item.type,
      sets: item.sets.map((s, idx) => ({
        id: crypto.randomUUID(),
        setNumber: idx + 1,
        weight: s.weight,
        reps: s.reps,
        time: s.time,
        distance: s.distance,
        completed: false,
      })),
    }));

    setSelectedDate(todayStr);
    setWorkoutExercises((prev) => [...prev, ...importedExercises]);
    setDetailModalDate(null);
    setActiveTab("log");
    triggerToast(`[${targetDate}] 운동 기록을 오늘(${todayStr}) 운동으로 가져왔습니다!`);
  };

  // 루틴 생성 모달: Day 추가 (순환형일 때)
  const handleAddCycleDay = () => {
    setCycleDays([
      ...cycleDays,
      { dayName: `Day ${cycleDays.length + 1}`, isRest: false, selectedExIds: [] },
    ]);
  };

  // 루틴 생성 모달: Day 삭제 (순환형일 때)
  const handleRemoveCycleDay = (idx: number) => {
    if (cycleDays.length <= 1) return alert("최소 1개 이상의 Day가 필요합니다.");
    const updated = [...cycleDays];
    updated.splice(idx, 1);
    setCycleDays(updated);
  };

  // 루틴 생성 저장
  const handleCreateRoutine = () => {
    if (!newRoutineTitle.trim()) return alert("루틴 제목을 입력해주세요.");

    const sourceDays = newRoutineType === "cycle" ? cycleDays : weekdayDays;
    
    const formattedDays: RoutineDay[] = sourceDays.map((d) => {
      const exDefs = exerciseList.filter((e) => d.selectedExIds.includes(e.id));
      return {
        dayName: d.dayName.trim() || "운동일",
        isRest: d.isRest,
        exercises: d.isRest
          ? []
          : exDefs.map((e) => ({
              exerciseName: e.name,
              category: e.category,
              equipment: e.equipment,
              unilateral: e.unilateral,
              type: e.type,
              defaultSets: 3,
              defaultWeight: e.type === "bodyweight" ? 0 : 30,
              defaultReps: 12,
            })),
      };
    });

    const newRt: RoutineDef = {
      id: crypto.randomUUID(),
      title: newRoutineTitle.trim(),
      purpose: newRoutinePurpose.trim() || "운동 목표 및 건강 유지",
      description:
        newRoutineDesc.trim() ||
        (newRoutineType === "cycle" ? "운동일/휴식일 순환 루틴" : "주간 요일 고정 루틴"),
      routineType: newRoutineType,
      days: formattedDays,
    };

    const updatedRoutines = [...routines, newRt];
    setRoutines(updatedRoutines);
    if (typeof window !== "undefined") {
      localStorage.setItem("gym_routines_v6", JSON.stringify(updatedRoutines));
    }

    setNewRoutineTitle("");
    setNewRoutinePurpose("");
    setNewRoutineDesc("");
    setNewRoutineType("cycle");
    setCycleDays([
      { dayName: "Day 1 (밀기)", isRest: false, selectedExIds: [] },
      { dayName: "Day 2 (당기기)", isRest: false, selectedExIds: [] },
      { dayName: "Day 3 (하체)", isRest: false, selectedExIds: [] },
      { dayName: "Day 4 (휴식)", isRest: true, selectedExIds: [] },
    ]);
    setWeekdayDays(WEEKDAYS.map((w) => ({ dayName: w, isRest: false, selectedExIds: [] })));
    setIsRoutineModalOpen(false);
  };

  const deleteRoutine = (rtId: string) => {
    if (confirm("이 루틴을 삭제하시겠습니까?")) {
      const updated = routines.filter((r) => r.id !== rtId);
      setRoutines(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("gym_routines_v6", JSON.stringify(updated));
      }
    }
  };

  // 달력 관련 계산
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfWeek = (year: number, month: number) => new Date(year, month, 1).getDay();

  const changeMonth = (delta: number) => {
    let newM = calMonth + delta;
    let newY = calYear;
    if (newM < 0) {
      newM = 11;
      newY -= 1;
    } else if (newM > 11) {
      newM = 0;
      newY += 1;
    }
    setCalYear(newY);
    setCalMonth(newM);
  };

  const categories = ["전체", "가슴", "등", "어깨", "하체", "복근", "이두", "삼두", "유산소"];
  const equipmentOptions = ["[바벨]", "[덤벨]", "[스미스]", "[케이블]", "[머신]", "[맨몸]", "[유산소]", "[기타]"];

  const filteredExercises = exerciseList.filter((ex) =>
    selectedCategory === "전체" ? true : ex.category === selectedCategory
  );

  return (
    <div className="max-w-2xl mx-auto min-h-screen p-3 sm:p-5 bg-[#0b0f19] text-slate-100 font-sans relative">
      {/* 저장 완료 토스트 알림 */}
      {showSaveToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <span>✅</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 상단바 */}
      <div className="flex justify-between items-center text-[11px] text-slate-400 mb-3 px-1">
        <span className="font-semibold text-slate-300">스마트 피트니스 트래커</span>
        {!isLoaded ? (
          <div className="h-5 w-16 bg-slate-800 animate-pulse rounded" />
        ) : !isSignedIn ? (
          <SignInButton mode="modal">
            <button className="text-blue-400 font-semibold hover:underline">로그인/회원가입</button>
          </SignInButton>
        ) : (
          <UserButton showName={false} />
        )}
      </div>

      {/* 탭 네비게이션 */}
      <div className="grid grid-cols-3 gap-2 bg-[#131927] p-1.5 rounded-xl border border-slate-800 mb-4">
        <button
          onClick={() => setActiveTab("log")}
          className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === "log"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>🏋️‍♂️</span>
          <span>운동 기록</span>
        </button>
        <button
          onClick={() => setActiveTab("routine")}
          className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === "routine"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>📋</span>
          <span>루틴 목록</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === "history"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>📅</span>
          <span>기록 달력</span>
        </button>
      </div>

      {/* --- TAB 1: 운동 기록 메인 화면 --- */}
      {activeTab === "log" && (
        <div className="space-y-4">
          {/* 종목 추가 드롭다운 */}
          <div className="bg-[#131927] border border-slate-800/80 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="text-blue-400">🔍</span>
                <span>종목 추가하기</span>
              </h3>
              <button
                onClick={() => setIsExModalOpen(true)}
                className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-500/30 transition flex items-center gap-1"
              >
                <span>⚙️</span>
                <span>종목 직접 만들기</span>
              </button>
            </div>

            {/* 카테고리 필터 */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-[#1a2234] text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 종목 선택 셀렉트 */}
            <select
              value={selectedExerciseId}
              onChange={(e) => handleSelectExercise(e.target.value)}
              className="w-full bg-[#1a2234] border border-slate-700/70 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
            >
              <option value="">-- [{selectedCategory}] 운동 선택 ({filteredExercises.length}개) --</option>
              {filteredExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.equipment} {ex.unilateral && ex.unilateral !== "없음" ? `${ex.unilateral} ` : ""}{ex.name} ({ex.category})
                </option>
              ))}
            </select>
          </div>

          {/* 날짜 선택 & 저장/삭제 버튼 */}
          <div className="flex justify-between items-center bg-[#131927] p-3 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>🗓️ 작성 날짜:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#1a2234] border border-slate-700 rounded-lg px-2 py-1 text-blue-400 font-bold text-xs focus:outline-none"
              />
            </span>

            <div className="flex gap-2">
              <button
                onClick={resetLog}
                className="px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-400 text-[11px] font-bold rounded-lg transition"
              >
                기록 삭제
              </button>

              <button
                onClick={handleManualSave}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-600/30 transition flex items-center gap-1"
              >
                <span>💾</span>
                <span>기록 저장</span>
              </button>
            </div>
          </div>

          {/* 운동 카드 목록 */}
          <div className="space-y-3">
            {workoutExercises.length === 0 ? (
              <div className="text-center py-12 bg-[#131927]/50 border border-dashed border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-500">선택된 운동이 없습니다.</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  상단에서 운동을 추가하거나 <b>[루틴 목록]</b> / <b>[기록 달력]</b>에서 불러오세요.
                </p>
              </div>
            ) : (
              workoutExercises.map((ex, exIdx) => (
                <div key={ex.id} className="bg-[#131927] border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5 text-[9px] text-slate-400">
                        <button onClick={() => moveExercise(exIdx, "up")} className="hover:text-blue-400 p-0.5 bg-slate-800 rounded">▲</button>
                        <button onClick={() => moveExercise(exIdx, "down")} className="hover:text-blue-400 p-0.5 bg-slate-800 rounded">▼</button>
                      </div>

                      <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-800/50 px-2 py-0.5 rounded font-bold">
                        {ex.category}
                      </span>

                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                        <span className="text-emerald-400">{ex.equipment}</span>
                        {ex.unilateral && ex.unilateral !== "없음" && (
                          <span className="text-amber-400">{ex.unilateral}</span>
                        )}
                        <span>{ex.exerciseName}</span>
                      </h4>
                    </div>

                    <button
                      onClick={() => removeExercise(exIdx)}
                      className="text-xs font-bold text-red-400 hover:text-red-300 transition px-1"
                    >
                      삭제
                    </button>
                  </div>

                  {/* 세트 입력 테이블 */}
                  <div className="space-y-1.5 text-xs">
                    <div className="grid grid-cols-12 gap-1 text-[10px] text-slate-400 text-center font-bold px-1">
                      <div className="col-span-2 text-left">세트</div>
                      <div className="col-span-4">
                        {ex.type === "cardio" ? "시간 (분)" : ex.type === "bodyweight" ? "증량 (kg)" : "무게 (kg)"}
                      </div>
                      <div className="col-span-3">{ex.type === "cardio" ? "거리 (km)" : "횟수"}</div>
                      <div className="col-span-2">완료</div>
                      <div className="col-span-1">삭제</div>
                    </div>

                    {ex.sets.map((set, setIdx) => (
                      <div key={set.id} className="grid grid-cols-12 gap-1.5 items-center text-center">
                        <div className="col-span-2 text-left text-[11px] font-bold text-slate-400 pl-1">
                          {set.setNumber}세트
                        </div>

                        <div className="col-span-4">
                          {ex.type === "cardio" ? (
                            <input
                              type="number"
                              placeholder="0분"
                              value={set.time ?? ""}
                              onChange={(e) => updateSetField(exIdx, setIdx, "time", Number(e.target.value))}
                              className="w-full bg-[#1a2234] border border-slate-700/60 rounded-lg py-1.5 px-2 text-center text-xs text-slate-100 font-bold focus:outline-none focus:border-blue-500"
                            />
                          ) : (
                            <input
                              type="number"
                              placeholder={ex.type === "bodyweight" ? "0 (맨몸)" : "0"}
                              value={set.weight ?? ""}
                              onChange={(e) => updateSetField(exIdx, setIdx, "weight", Number(e.target.value))}
                              className="w-full bg-[#1a2234] border border-slate-700/60 rounded-lg py-1.5 px-2 text-center text-xs text-slate-100 font-bold focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>

                        <div className="col-span-3">
                          {ex.type === "cardio" ? (
                            <input
                              type="number"
                              placeholder="0km"
                              value={set.distance ?? ""}
                              onChange={(e) => updateSetField(exIdx, setIdx, "distance", Number(e.target.value))}
                              className="w-full bg-[#1a2234] border border-slate-700/60 rounded-lg py-1.5 px-2 text-center text-xs text-slate-100 font-bold focus:outline-none focus:border-blue-500"
                            />
                          ) : (
                            <input
                              type="number"
                              value={set.reps ?? ""}
                              onChange={(e) => updateSetField(exIdx, setIdx, "reps", Number(e.target.value))}
                              className="w-full bg-[#1a2234] border border-slate-700/60 rounded-lg py-1.5 px-2 text-center text-xs text-slate-100 font-bold focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>

                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() => toggleSetCompleted(exIdx, setIdx)}
                            className={`w-full py-1 rounded-lg font-bold text-xs transition flex items-center justify-center ${
                              set.completed
                                ? "bg-emerald-600 text-white shadow"
                                : "bg-[#1a2234] border border-slate-700 text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            ✓
                          </button>
                        </div>

                        <div className="col-span-1 flex justify-center">
                          <button
                            onClick={() => removeSet(exIdx, setIdx)}
                            className="text-red-400 hover:text-red-300 font-bold text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addSet(exIdx)}
                    className="w-full py-2 bg-[#1a2234] hover:bg-slate-800 text-slate-300 text-[11px] font-bold rounded-xl border border-slate-700/50 transition"
                  >
                    + 세트 추가
                  </button>
                </div>
              ))
            )}
          </div>

          {/* 메인 탭 하단 저장 버튼 */}
          {workoutExercises.length > 0 && (
            <div className="space-y-1.5">
              <button
                onClick={handleManualSave}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <span>💾</span>
                <span>완료한 운동 세트 저장하기</span>
              </button>
              <p className="text-[10px] text-slate-500 text-center">
                * ✓ 완료 체크한 세트만 달력 및 기록에 정상 저장됩니다.
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: 루틴 목록 & 생성 --- */}
      {activeTab === "routine" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#131927] p-4 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">📋 나만의 운동 루틴 관리</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">목적별로 루틴을 한눈에 파악하고 오늘 운동으로 바로 적용하세요.</p>
            </div>
            <button
              onClick={() => setIsRoutineModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center gap-1"
            >
              <span>+</span>
              <span>새 루틴 생성</span>
            </button>
          </div>

          {/* 루틴 목록 요약 카드 리스트 */}
          <div className="space-y-4">
            {routines.map((rt) => {
              const categoriesInRoutine = Array.from(
                new Set(
                  rt.days
                    .flatMap((d) => d.exercises)
                    .map((e) => e.category)
                    .filter(Boolean)
                )
              );

              return (
                <div key={rt.id} className="bg-[#131927] border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-md">
                  <div className="flex justify-between items-start border-b border-slate-800/80 pb-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                            rt.routineType === "weekday"
                              ? "bg-purple-950 text-purple-300 border-purple-800/50"
                              : "bg-amber-950 text-amber-300 border-amber-800/50"
                          }`}
                        >
                          {rt.routineType === "weekday" ? "📅 요일 고정형" : "🔄 순환형"}
                        </span>

                        {rt.purpose && (
                          <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                            <span>🎯</span>
                            <span>{rt.purpose}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-100">{rt.title}</h4>
                      <p className="text-xs text-slate-400">{rt.description}</p>

                      {categoriesInRoutine.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1 text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-300">주요 타겟:</span>
                          <div className="flex gap-1 flex-wrap">
                            {categoriesInRoutine.map((cat) => (
                              <span key={cat} className="bg-[#1a2234] border border-slate-700/60 px-1.5 py-0.5 rounded text-slate-300 font-medium">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button onClick={() => deleteRoutine(rt.id)} className="text-xs text-red-400 hover:text-red-300 font-semibold px-1">
                      삭제
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {rt.days.map((day, dIdx) => (
                      <div key={dIdx} className="bg-[#1a2234] rounded-xl p-3 border border-slate-700/50 space-y-2 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center border-b border-slate-700/40 pb-1.5">
                            <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                              <span>{day.isRest ? "☕" : "💪"}</span>
                              <span>{day.dayName}</span>
                              {day.isRest && <span className="text-[10px] text-amber-400 font-semibold">(휴식일)</span>}
                            </span>
                          </div>

                          {day.isRest ? (
                            <p className="text-[11px] text-slate-400 py-1 italic">휴식을 취하며 근육 재생을 돕습니다.</p>
                          ) : (
                            <div className="space-y-1">
                              {day.exercises.map((item, exIdx) => (
                                <div key={exIdx} className="flex justify-between items-center text-xs">
                                  <span className="text-slate-300 font-medium">
                                    <span className="text-emerald-400 mr-1">{item.equipment}</span>
                                    {item.unilateral && item.unilateral !== "없음" && (
                                      <span className="text-amber-400 mr-1">{item.unilateral}</span>
                                    )}
                                    {item.exerciseName}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {item.type === "cardio"
                                      ? `${item.defaultSets}세트`
                                      : `${item.defaultSets}세트 (${item.defaultWeight}kg)`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {!day.isRest && (
                          <button
                            onClick={() => applyRoutineDayToToday(day)}
                            className="w-full mt-2 text-[11px] bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 shadow"
                          >
                            <span>⚡</span>
                            <span>오늘 운동으로 가져오기</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 3: 기록 달력 --- */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="bg-[#131927] border border-slate-800 rounded-2xl p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>📅</span>
                <span>{calYear}년 {calMonth + 1}월</span>
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-1.5 px-3 bg-[#1a2234] hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-700"
                >
                  ◀ 이전달
                </button>
                <button
                  onClick={() => {
                    setCalYear(new Date().getFullYear());
                    setCalMonth(new Date().getMonth());
                  }}
                  className="p-1.5 px-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/30"
                >
                  오늘
                </button>
                <button
                  onClick={() => changeMonth(1)}
                  className="p-1.5 px-3 bg-[#1a2234] hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-700"
                >
                  다음달 ▶
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400">
              <div className="text-red-400">일</div>
              <div>월</div>
              <div>화</div>
              <div>수</div>
              <div>목</div>
              <div>금</div>
              <div className="text-blue-400">토</div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: getFirstDayOfWeek(calYear, calMonth) }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[72px] bg-[#0d121f]/40 rounded-xl border border-slate-800/30 opacity-20" />
              ))}

              {Array.from({ length: getDaysInMonth(calYear, calMonth) }).map((_, i) => {
                const dayNum = i + 1;
                const formattedDate = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                
                const dayLogs = allLogs[formattedDate] || [];
                const hasLogs = dayLogs.length > 0;
                const isToday = formattedDate === new Date().toISOString().split("T")[0];

                return (
                  <div
                    key={formattedDate}
                    onClick={() => {
                      if (hasLogs) setDetailModalDate(formattedDate);
                    }}
                    className={`min-h-[74px] p-1.5 rounded-xl border flex flex-col justify-between transition relative ${
                      hasLogs
                        ? "bg-[#1a2234] border-blue-500/50 hover:border-blue-400 cursor-pointer shadow-md"
                        : "bg-[#131927] border-slate-800/80 text-slate-600"
                    } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-[11px] font-bold ${isToday ? "text-blue-400" : hasLogs ? "text-slate-200" : "text-slate-500"}`}>
                        {dayNum}
                      </span>
                      {hasLogs && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      )}
                    </div>

                    <div className="space-y-0.5 my-1">
                      {hasLogs ? (
                        <>
                          {dayLogs.slice(0, 2).map((item, idx) => (
                            <div
                              key={idx}
                              className="text-[9px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/40 rounded px-1 py-0.5 truncate"
                            >
                              {item.exerciseName}
                            </div>
                          ))}
                          {dayLogs.length > 2 && (
                            <p className="text-[8px] text-slate-400 font-bold text-right">
                              +{dayLogs.length - 2}개 더보기
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="h-4" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- 모달 1: 달력 날짜 상세 기록 모달 --- */}
      {detailModalDate && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131927] border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <span>🗓️</span>
                  <span>{detailModalDate} 완료된 운동</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  총 {allLogs[detailModalDate]?.length || 0}개 종목 완료
                </p>
              </div>
              <button
                onClick={() => setDetailModalDate(null)}
                className="text-slate-400 hover:text-slate-200 font-bold text-base px-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1">
              {(allLogs[detailModalDate] || []).map((ex, idx) => (
                <div key={idx} className="bg-[#1a2234] border border-slate-700/60 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-700/50 pb-1.5">
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1">
                      <span className="text-emerald-400">{ex.equipment}</span>
                      {ex.unilateral && ex.unilateral !== "없음" && (
                        <span className="text-amber-400">{ex.unilateral}</span>
                      )}
                      <span>{ex.exerciseName}</span>
                    </span>
                    <span className="text-[10px] bg-blue-950 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-800/40">
                      {ex.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {ex.sets.map((s) => (
                      <div
                        key={s.id}
                        className="p-1.5 rounded-lg border bg-emerald-950/30 border-emerald-800/50 text-emerald-300 flex justify-between items-center"
                      >
                        <span className="font-bold">{s.setNumber}세트</span>
                        <span>
                          {ex.type === "cardio"
                            ? `${s.time ?? 0}분 / ${s.distance ?? 0}km`
                            : ex.type === "bodyweight"
                            ? `+${s.weight ?? 0}kg / ${s.reps ?? 0}회`
                            : `${s.weight ?? 0}kg / ${s.reps ?? 0}회`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => importCalendarLogToToday(detailModalDate)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
              >
                <span>⚡</span>
                <span>이 날의 운동을 오늘 루틴으로 가져오기</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setDetailModalDate(null)}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl transition"
                >
                  닫기
                </button>
                <button
                  onClick={() => {
                    setSelectedDate(detailModalDate);
                    setDetailModalDate(null);
                    setActiveTab("log");
                  }}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1"
                >
                  <span>✏️</span>
                  <span>이 날짜 수정하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 모달 2: 종목 직접 만들기 --- */}
      {isExModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131927] border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>⚙️</span>
              <span>종목 직접 만들기</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">운동 이름</label>
                <input
                  type="text"
                  placeholder="예: 숄더 프레스"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  className="w-full bg-[#1a2234] border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">운동 부위</label>
                <select
                  value={newExCategory}
                  onChange={(e) => setNewExCategory(e.target.value)}
                  className="w-full bg-[#1a2234] border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  {categories.filter((c) => c !== "전체").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">장비 구분</label>
                <select
                  value={newExEquipment}
                  onChange={(e) => setNewExEquipment(e.target.value)}
                  className="w-full bg-[#1a2234] border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500 text-emerald-400 font-bold"
                >
                  {equipmentOptions.map((eq) => (
                    <option key={eq} value={eq}>{eq}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">단일 수행 여부</label>
                <select
                  value={newExUnilateral}
                  onChange={(e) => setNewExUnilateral(e.target.value)}
                  className="w-full bg-[#1a2234] border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500 text-amber-400 font-bold"
                >
                  <option value="없음">양손/양발 (기본)</option>
                  <option value="[원암]">[원암] 한 손 수행</option>
                  <option value="[원레그]">[원레그] 한 발 수행</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">운동 유형</label>
                <select
                  value={newExType}
                  onChange={(e) => setNewExType(e.target.value as ExerciseType)}
                  className="w-full bg-[#1a2234] border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="weight">웨이트 (무게 + 횟수)</option>
                  <option value="bodyweight">맨몸 운동 (증량kg + 횟수)</option>
                  <option value="cardio">유산소 (시간 + 거리)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsExModalOpen(false)}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl transition"
              >
                취소
              </button>
              <button
                onClick={handleCreateCustomExercise}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/30"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 모달 3: 커스텀 루틴 생성 모달 --- */}
      {isRoutineModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#131927] border border-slate-700 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>📋</span>
              <span>새 운동 루틴 만들기</span>
            </h3>

            <div className="space-y-3 text-xs overflow-y-auto pr-1">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">루틴 이름</label>
                <input
                  type="text"
                  placeholder="예: 3분할 순환 루틴 또는 직장인 주간 루틴"
                  value={newRoutineTitle}
                  onChange={(e) => setNewRoutineTitle(e.target.value)}
                  className="w-full bg-[#1a2234] border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-emerald-400 mb-1 font-bold">🎯 루틴 목적 (목표)</label>
                <input
                  type="text"
                  placeholder="예: 근육 비대, 체지방 감량, 스트렝스 향상, 3분할 체력 관리 등"
                  value={newRoutinePurpose}
                  onChange={(e) => setNewRoutinePurpose(e.target.value)}
                  className="w-full bg-[#1a2234] border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">루틴 상세 설명</label>
                <input
                  type="text"
                  placeholder="예: 가슴-등-하체 순환 운동"
                  value={newRoutineDesc}
                  onChange={(e) => setNewRoutineDesc(e.target.value)}
                  className="w-full bg-[#1a2234] border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">루틴 타입 선택</label>
                <div className="grid grid-cols-2 gap-2 bg-[#1a2234] p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setNewRoutineType("cycle")}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      newRoutineType === "cycle"
                        ? "bg-amber-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    🔄 운동일/휴식일 순환형
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRoutineType("weekday")}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      newRoutineType === "weekday"
                        ? "bg-purple-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    📅 요일 고정형 (월~일)
                  </button>
                </div>
              </div>

              {newRoutineType === "cycle" && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-400">Day별 운동 구성</span>
                    <button
                      type="button"
                      onClick={handleAddCycleDay}
                      className="text-[11px] bg-amber-600/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg font-bold hover:bg-amber-600/30 transition"
                    >
                      + Day 추가
                    </button>
                  </div>

                  {cycleDays.map((cDay, idx) => (
                    <div key={idx} className="bg-[#1a2234] border border-slate-700/80 rounded-xl p-3 space-y-2">
                      <div className="flex justify-between items-center gap-2">
                        <input
                          type="text"
                          value={cDay.dayName}
                          onChange={(e) => {
                            const updated = [...cycleDays];
                            updated[idx].dayName = e.target.value;
                            setCycleDays(updated);
                          }}
                          className="bg-[#131927] border border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-100 flex-1 focus:outline-none"
                        />

                        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-amber-300 font-semibold bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40">
                          <input
                            type="checkbox"
                            checked={cDay.isRest}
                            onChange={(e) => {
                              const updated = [...cycleDays];
                              updated[idx].isRest = e.target.checked;
                              setCycleDays(updated);
                            }}
                          />
                          <span>휴식일</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveCycleDay(idx)}
                          className="text-xs text-red-400 font-bold px-1"
                        >
                          ✕
                        </button>
                      </div>

                      {!cDay.isRest && (
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 font-medium">운동 선택:</p>
                          <div className="max-h-32 overflow-y-auto bg-[#131927] border border-slate-700/60 rounded-lg p-1.5 space-y-1">
                            {exerciseList.map((ex) => {
                              const isChecked = cDay.selectedExIds.includes(ex.id);
                              return (
                                <div
                                  key={ex.id}
                                  onClick={() => {
                                    const updated = [...cycleDays];
                                    if (isChecked) {
                                      updated[idx].selectedExIds = updated[idx].selectedExIds.filter((id) => id !== ex.id);
                                    } else {
                                      updated[idx].selectedExIds.push(ex.id);
                                    }
                                    setCycleDays(updated);
                                  }}
                                  className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition text-[11px] ${
                                    isChecked ? "bg-amber-600/30 text-white font-bold border border-amber-500/40" : "text-slate-400 hover:bg-slate-800"
                                  }`}
                                >
                                  <span>{ex.equipment} {ex.name}</span>
                                  <span className="text-[9px]">{ex.category}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {newRoutineType === "weekday" && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-purple-400">요일별 운동 구성 (월~일)</span>

                  {weekdayDays.map((wDay, idx) => (
                    <div key={idx} className="bg-[#1a2234] border border-slate-700/80 rounded-xl p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-100">{wDay.dayName}</span>

                        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-purple-300 font-semibold bg-purple-950/40 px-2 py-1 rounded border border-purple-800/40">
                          <input
                            type="checkbox"
                            checked={wDay.isRest}
                            onChange={(e) => {
                              const updated = [...weekdayDays];
                              updated[idx].isRest = e.target.checked;
                              setWeekdayDays(updated);
                            }}
                          />
                          <span>휴식일로 지정</span>
                        </label>
                      </div>

                      {!wDay.isRest && (
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 font-medium">운동 선택:</p>
                          <div className="max-h-28 overflow-y-auto bg-[#131927] border border-slate-700/60 rounded-lg p-1.5 space-y-1">
                            {exerciseList.map((ex) => {
                              const isChecked = wDay.selectedExIds.includes(ex.id);
                              return (
                                <div
                                  key={ex.id}
                                  onClick={() => {
                                    const updated = [...weekdayDays];
                                    if (isChecked) {
                                      updated[idx].selectedExIds = updated[idx].selectedExIds.filter((id) => id !== ex.id);
                                    } else {
                                      updated[idx].selectedExIds.push(ex.id);
                                    }
                                    setWeekdayDays(updated);
                                  }}
                                  className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition text-[11px] ${
                                    isChecked ? "bg-purple-600/30 text-white font-bold border border-purple-500/40" : "text-slate-400 hover:bg-slate-800"
                                  }`}
                                >
                                  <span>{ex.equipment} {ex.name}</span>
                                  <span className="text-[9px]">{ex.category}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsRoutineModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl transition"
              >
                취소
              </button>
              <button
                onClick={handleCreateRoutine}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/30"
              >
                루틴 저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}