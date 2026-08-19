'use client';

import { useState } from 'react';

// 예시용 기본 운동 목록 (필요시 기존 DB 데이터와 연결)
const DEFAULT_EXERCISES = [
  { id: '1', name: '벤치프레스', type: 'weight' },
  { id: '2', name: '턱걸이 (풀업)', type: 'reps_only' },
  { id: '3', name: '딥스', type: 'reps_only' },
  { id: '4', name: '러닝', type: 'cardio' },
];

export default function ExercisePage() {
  // 등록된 운동 목록 상태
  const [exercises] = useState(DEFAULT_EXERCISES);
  const [selectedExerciseId, setSelectedExerciseId] = useState(DEFAULT_EXERCISES[0].id);

  // 현재 선택된 운동 정보
  const selectedExercise = exercises.find((e) => e.id === selectedExerciseId) || exercises[0];

  // 입력 필드 상태
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');

  // 맨몸 운동 시 무게 입력창 표시 여부
  const [showWeightInput, setShowWeightInput] = useState(false);

  // 세트 데이터
  const [sets, setSets] = useState<any[]>([]);

  // 세트 추가
  const handleAddSet = (e: React.FormEvent) => {
    e.preventDefault();

    const newSet: any = {
      id: Date.now().toString(),
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      type: selectedExercise.type,
    };

    if (selectedExercise.type === 'weight') {
      if (!reps || !weight) return alert('무게와 횟수를 입력해주세요.');
      newSet.reps = Number(reps);
      newSet.weight = Number(weight);
    } else if (selectedExercise.type === 'reps_only') {
      if (!reps) return alert('횟수를 입력해주세요.');
      newSet.reps = Number(reps);
      if (showWeightInput && weight) {
        newSet.weight = Number(weight);
      }
    } else if (selectedExercise.type === 'cardio') {
      if (!duration) return alert('시간을 입력해주세요.');
      newSet.durationMinutes = Number(duration);
      if (distance) newSet.distanceKm = Number(distance);
    }

    setSets([...sets, newSet]);

    // 입력창 리셋
    setReps('');
    setWeight('');
    setDuration('');
    setDistance('');
  };

  const handleDeleteSet = (id: string) => {
    setSets(sets.filter((s) => s.id !== id));
  };

  return (
    <main className="max-w-lg mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">운동 기록 작성</h1>

      {/* 1. 운동 종목 선택 */}
      <div className="border p-4 rounded-lg bg-white shadow-sm space-y-2">
        <label className="block text-sm font-medium">운동 종목 선택</label>
        <select
          value={selectedExerciseId}
          onChange={(e) => {
            setSelectedExerciseId(e.target.value);
            setShowWeightInput(false);
          }}
          className="w-full border p-2 rounded text-base"
        >
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name} ({ex.type === 'weight' ? '웨이트' : ex.type === 'reps_only' ? '맨몸' : '유산소'})
            </option>
          ))}
        </select>
      </div>

      {/* 2. 선택된 운동에 맞춤 입력 폼 */}
      <form onSubmit={handleAddSet} className="border p-4 rounded-lg bg-white shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">{selectedExercise.name} 세트 추가</h2>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
            {selectedExercise.type === 'weight' && '무게 + 횟수'}
            {selectedExercise.type === 'reps_only' && '횟수 중심'}
            {selectedExercise.type === 'cardio' && '시간 + 거리'}
          </span>
        </div>

        {/* 웨이트 타입 입력 */}
        {selectedExercise.type === 'weight' && (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="무게 (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="border p-2 rounded w-1/2"
            />
            <input
              type="number"
              placeholder="횟수 (회)"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="border p-2 rounded w-1/2"
            />
          </div>
        )}

        {/* 맨몸 타입 입력 (기본: 횟수 / 버튼 클릭 시: 중량 or 보조 무게) */}
        {selectedExercise.type === 'reps_only' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="횟수 (회)"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="border p-2 rounded flex-1"
              />
              <button
                type="button"
                onClick={() => setShowWeightInput(!showWeightInput)}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded border whitespace-nowrap"
              >
                {showWeightInput ? '무게 닫기' : '+ 중량/보조 kg'}
              </button>
            </div>

            {showWeightInput && (
              <div className="flex items-center gap-2 pl-2 border-l-2 border-blue-400">
                <input
                  type="number"
                  placeholder="무게 (kg) 예: +10 또는 -5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="border p-2 rounded flex-1 text-sm"
                />
                <span className="text-xs text-gray-500">* 중량(+), 보조(-)</span>
              </div>
            )}
          </div>
        )}

        {/* 유산소 타입 입력 */}
        {selectedExercise.type === 'cardio' && (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="시간 (분)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="border p-2 rounded w-1/2"
            />
            <input
              type="number"
              placeholder="거리 (km, 선택)"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="border p-2 rounded w-1/2"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
        >
          세트 추가
        </button>
      </form>

      {/* 3. 세트 기록 리스트 */}
      <div className="border p-4 rounded-lg bg-white shadow-sm space-y-3">
        <h2 className="font-semibold text-lg">기록된 세트 ({sets.length})</h2>
        {sets.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">추가된 세트가 없습니다.</p>
        ) : (
          <ul className="divide-y">
            {sets.map((set, index) => (
              <li key={set.id} className="py-2 flex justify-between items-center text-sm">
                <span>
                  <strong>[{set.exerciseName}]</strong> {index + 1}세트: {' '}
                  {set.type === 'weight' && `${set.weight}kg × ${set.reps}회`}
                  {set.type === 'reps_only' && (
                    <>
                      {set.reps}회
                      {set.weight !== undefined && ` (${set.weight > 0 ? `+${set.weight}` : set.weight}kg)`}
                    </>
                  )}
                  {set.type === 'cardio' && `${set.durationMinutes}분 ${set.distanceKm ? `/ ${set.distanceKm}km` : ''}`}
                </span>
                <button onClick={() => handleDeleteSet(set.id)} className="text-red-500 text-xs">
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}