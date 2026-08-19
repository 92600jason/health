'use client';

import { useState } from 'react';
import { ExerciseType, SetLog } from '@/types/exercise';

export default function ExercisePage() {
  // 운동 종류 및 입력 상태
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState<ExerciseType>('weight');

  // 입력 필드 상태
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');

  // 맨몸 운동 시 무게 입력창 표시 여부
  const [showWeightInput, setShowWeightInput] = useState(false);

  // 세트 리스트 상태
  const [sets, setSets] = useState<SetLog[]>([]);

  // 세트 추가 함수
  const handleAddSet = (e: React.FormEvent) => {
    e.preventDefault();

    const newSet: SetLog = {
      id: Date.now().toString(),
    };

    if (exerciseType === 'weight') {
      if (!reps || !weight) return alert('무게와 횟수를 모두 입력해주세요.');
      newSet.reps = Number(reps);
      newSet.weight = Number(weight);
    } else if (exerciseType === 'reps_only') {
      if (!reps) return alert('횟수를 입력해주세요.');
      newSet.reps = Number(reps);
      if (showWeightInput && weight) {
        newSet.weight = Number(weight);
      }
    } else if (exerciseType === 'cardio') {
      if (!duration) return alert('운동 시간을 입력해주세요.');
      newSet.durationMinutes = Number(duration);
      if (distance) newSet.distanceKm = Number(distance);
    }

    setSets([...sets, newSet]);

    // 입력창 초기화 (무게/횟수 유지 원할 시 조정 가능)
    setReps('');
    setWeight('');
    setDuration('');
    setDistance('');
  };

  // 세트 삭제 함수
  const handleDeleteSet = (id: string) => {
    setSets(sets.filter((s) => s.id !== id));
  };

  return (
    <main className="max-w-lg mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">운동 기록 작성</h1>

      {/* 1. 운동 이름 및 타입 선택 */}
      <div className="space-y-3 border p-4 rounded-lg bg-white shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">운동 이름</label>
          <input
            type="text"
            placeholder="예: 턱걸이, 벤치프레스, 러닝"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">운동 타입</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setExerciseType('weight');
                setShowWeightInput(false);
              }}
              className={`p-2 border rounded text-sm font-medium ${
                exerciseType === 'weight' ? 'bg-blue-600 text-white' : 'bg-gray-50'
              }`}
            >
              웨이트 (무게+횟수)
            </button>
            <button
              type="button"
              onClick={() => setExerciseType('reps_only')}
              className={`p-2 border rounded text-sm font-medium ${
                exerciseType === 'reps_only' ? 'bg-blue-600 text-white' : 'bg-gray-50'
              }`}
            >
              맨몸 (횟수 중심)
            </button>
            <button
              type="button"
              onClick={() => {
                setExerciseType('cardio');
                setShowWeightInput(false);
              }}
              className={`p-2 border rounded text-sm font-medium ${
                exerciseType === 'cardio' ? 'bg-blue-600 text-white' : 'bg-gray-50'
              }`}
            >
              유산소 (시간/거리)
            </button>
          </div>
        </div>
      </div>

      {/* 2. 세트 입력 폼 */}
      <form onSubmit={handleAddSet} className="border p-4 rounded-lg bg-white shadow-sm space-y-4">
        <h2 className="font-semibold text-lg">세트 추가</h2>

        {/* 웨이트 타입 입력 */}
        {exerciseType === 'weight' && (
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

        {/* 맨몸 운동 타입 입력 (기본: 횟수 / 토글: 추가 중량 or 보조) */}
        {exerciseType === 'reps_only' && (
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
                {showWeightInput ? '무게 입력 닫기' : '+ 중량/보조 kg'}
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
                <span className="text-xs text-gray-500">
                  * 중량 턱걸이(+10), 밴드 보조(-5)
                </span>
              </div>
            )}
          </div>
        )}

        {/* 유산소 타입 입력 */}
        {exerciseType === 'cardio' && (
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
          세트 기록 추가
        </button>
      </form>

      {/* 3. 기록된 세트 리스트 */}
      <div className="border p-4 rounded-lg bg-white shadow-sm space-y-3">
        <h2 className="font-semibold text-lg">기록된 세트 ({sets.length})</h2>
        {sets.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            아직 추가된 세트가 없습니다.
          </p>
        ) : (
          <ul className="divide-y">
            {sets.map((set, index) => (
              <li key={set.id} className="py-2 flex justify-between items-center text-sm">
                <span>
                  <strong>{index + 1}세트:</strong>{' '}
                  {exerciseType === 'weight' && `${set.weight}kg × ${set.reps}회`}
                  {exerciseType === 'reps_only' && (
                    <>
                      {set.reps}회
                      {set.weight !== undefined && (
                        <span className="text-blue-600 font-medium ml-1">
                          ({set.weight > 0 ? `+${set.weight}` : set.weight}kg)
                        </span>
                      )}
                    </>
                  )}
                  {exerciseType === 'cardio' && (
                    <>
                      {set.durationMinutes}분
                      {set.distanceKm && ` / ${set.distanceKm}km`}
                    </>
                  )}
                </span>
                <button
                  onClick={() => handleDeleteSet(set.id)}
                  className="text-red-500 hover:underline text-xs"
                >
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