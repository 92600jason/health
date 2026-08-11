'use client';

import { useState } from 'react';

export default function Home() {
  const [title, setTitle] = useState('상체 A (밀기 + 삼두)');
  const [exercise, setExercise] = useState('스미스 벤치프레스');
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(15);
  const [restTime, setRestTime] = useState(45);

  const [logs, setLogs] = useState<any[]>([]);

  const handleAddSet = () => {
    const newSet = { exercise, weight, reps, restTime };
    setLogs([...logs, newSet]);
  };

  return (
    <main className="max-w-md mx-auto p-4 min-h-screen bg-slate-50 text-slate-900">
      <h1 className="text-2xl font-bold mb-4 text-center">🏋️ Gym Tracker</h1>

      {/* 루틴 선택 */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <label className="text-sm font-semibold text-gray-500">오늘의 루틴</label>
        <select 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
        >
          <option>상체 A (밀기 + 삼두)</option>
          <option>하체 & 등 (당기기 + 이두)</option>
          <option>상체 B (밀기 + 어깨)</option>
        </select>
      </div>

      {/* 운동 입력 폼 */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
        <div>
          <label className="text-xs text-gray-500">종목명</label>
          <input 
            type="text" 
            value={exercise} 
            onChange={(e) => setExercise(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-gray-500">무게 (kg)</label>
            <input 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full p-2 border rounded-lg text-center"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">횟수 (회)</label>
            <input 
              type="number" 
              value={reps} 
              onChange={(e) => setReps(Number(e.target.value))}
              className="w-full p-2 border rounded-lg text-center"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">휴식 (초)</label>
            <input 
              type="number" 
              value={restTime} 
              onChange={(e) => setRestTime(Number(e.target.value))}
              className="w-full p-2 border rounded-lg text-center"
            />
          </div>
        </div>

        <button 
          onClick={handleAddSet}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg active:bg-blue-700 transition"
        >
          세트 추가하기
        </button>
      </div>

      {/* 기록된 세트 목록 */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="font-bold mb-2">오늘 기록된 세트 ({logs.length})</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">아직 세트 기록이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log, index) => (
              <li key={index} className="flex justify-between items-center text-sm p-2 bg-slate-100 rounded-lg">
                <span className="font-semibold">{log.exercise}</span>
                <span className="text-gray-600">{log.weight}kg × {log.reps}회 ({log.restTime}초 휴식)</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}