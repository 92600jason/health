'use client';

import { useState } from 'react';

const EXERCISE_LIST: Record<string, string[]> = {
  가슴: [
    '바벨 벤치프레스 (프리)', '덤벨 벤치프레스 (프리)', '인클라인 바벨 벤치프레스 (프리)', '인클라인 덤벨 벤치프레스 (프리)', '디클라인 벤치프레스 (프리)', '덤벨 풀오버 (프리)',
    '체스트 프레스 머신 (머신)', '인클라인 체스트 프레스 머신 (머신)', '펙덱 플라이 머신 (머신)', '시티드 디클라인 프레스 머신 (머신)',
    '케이블 크로스오버 (케이블)', '케이블 하이 로우 플라이 (케이블)', '케이블 로우 하이 플라이 (케이블)',
    '푸시업 (맨몸)', '딥스 (가슴 자극) (맨몸)'
  ],
  등: [
    '컨벤셔널 데드리프트 (프리)', '루마니안 데드리프트 (프리)', '펜들레이 로우 (프리)', '바벨 벤트오버 로우 (프리)', '원암 덤벨 로우 (프리)', 'T바 로우 (프리)',
    '랫풀다운 (머신)', '시티드 케이블 로우 (머신)', '어시스트 풀업 머신 (머신)', '파머스 머신 랫풀다운 (머신)', '하이 로우 머신 (머신)', '백 로우 머신 (머신)',
    '케이블 암 풀다운 (케이블)', '케이블 페이스 풀 (케이블)', '케이블 원암 로우 (케이블)',
    '풀업 (턱걸이) (맨몸)', '친업 (맨몸)'
  ],
  어깨: [
    '오버헤드 프레스 (OHP) (프리)', '덤벨 숄더 프레스 (프리)', '덤벨 사이드 레터럴 레이즈 (프리)', '덤벨 프론트 레이즈 (프리)', '덤벨 벤트오버 레터럴 레이즈 (프리)', '인클라인 덤벨 사이드 레이즈 (프리)',
    '숄더 프레스 머신 (머신)', '리버스 펙덱 플라이 (후면) (머신)', '사이드 레터럴 레이즈 머신 (머신)',
    '케이블 사이드 레터럴 레이즈 (케이블)', '케이블 페이스 풀 (어깨) (케이블)', '케이블 프론트 레이즈 (케이블)', '케이블 후면 삼각근 플라이 (케이블)'
  ],
  하체: [
    '바벨 백 스쿼트 (프리)', '바벨 프론트 스쿼트 (프리)', '덤벨 고블렛 스쿼트 (프리)', '바벨 런지 (프리)', '덤벨 워킹 런지 (프리)', '스티프 레그 데드리프트 (프리)',
    '레그 프레스 (머신)', '파워 레그 프레스 (머신)', '레그 익스텐션 (머신)', '라이잉 레그 컬 (머신)', '시티드 레그 컬 (머신)', '이너 쓰아이/아웃타이 머신 (머신)', '힙 어덕션 (머신)', '스미스 머신 스쿼트 (머신)', '스미스 머신 런지 (머신)', '스탠딩 카프 레이즈 머신 (머신)',
    '케이블 힙 어덕션 (케이블)', '케이블 킥백 (케이블)'
  ],
  삼두: [
    '라잉 트라이셉스 익스텐션 (바벨) (프리)', '클로즈 그립 벤치프레스 (프리)', '덤벨 오버헤드 트라이셉스 익스텐션 (프리)', '원암 덤벨 킥백 (프리)',
    '딥스 머신 (머신)', '시티드 트라이셉스 프레스 머신 (머신)',
    '케이블 트라이셉스 푸시다운 (바) (케이블)', '케이블 트라이셉스 푸시다운 (로프) (케이블)', '케이블 오버헤드 트라이셉스 익스텐션 (케이블)', '케이블 원암 푸시다운 (케이블)'
  ],
  이두: [
    '바벨 컬 (프리)', '덤벨 컬 (프리)', '덤벨 해머 컬 (프리)', '인클라인 덤벨 컬 (프리)', '컨센트레이션 컬 (프리)',
    '프리처 컬 머신 (머신)', '암 컬 머신 (머신)',
    '케이블 바벨 컬 (케이블)', '케이블 해머 컬 (케이블)', '케이블 바이셉스 컬 (케이블)'
  ],
  '복근 / 악력 / 기타': [
    '행잉 레그 레이즈 (맨몸)', '크런치 (맨몸)', '플랭크 (맨몸)', '라잉 레그 레이즈 (맨몸)',
    '케이블 크런치 (케이블)', 'AB 슬라이드 (기구)', '악력기 훈련 (기구)', '리스트 컬 (바벨/덤벨) (프리)', '리버스 리스트 컬 (프리)', '파머스 워크 (악력/전신) (프리)'
  ]
};

export default function Home() {
  const [routine, setRoutine] = useState('상체 A (밀기 + 삼두)');
  const [category, setCategory] = useState<string>('가슴');
  const [exercise, setExercise] = useState<string>(EXERCISE_LIST['가슴'][0]);
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(15);
  const [restTime, setRestTime] = useState(45);

  const [logs, setLogs] = useState<any[]>([]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setExercise(EXERCISE_LIST[newCategory][0]);
  };

  const handleAddSet = () => {
    const newSet = { category, exercise, weight, reps, restTime };
    setLogs([...logs, newSet]);
  };

  return (
    <main className="max-w-md mx-auto p-4 min-h-screen bg-slate-50 text-slate-900">
      <h1 className="text-2xl font-bold mb-4 text-center">🏋️ Gym Tracker</h1>

      {/* 루틴 선택 */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <label className="text-xs font-semibold text-gray-500">오늘의 루틴</label>
        <select 
          value={routine} 
          onChange={(e) => setRoutine(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg bg-gray-50 text-sm font-bold"
        >
          <option>상체 A (밀기 + 삼두)</option>
          <option>하체 & 등 (당기기 + 이두)</option>
          <option>상체 B (밀기 + 어깨)</option>
        </select>
      </div>

      {/* 운동 입력 폼 */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
        {/* 부위 선택 */}
        <div>
          <label className="text-xs text-gray-500 font-semibold">타겟 부위</label>
          <select 
            value={category} 
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg text-sm bg-slate-50"
          >
            {Object.keys(EXERCISE_LIST).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* 세부 종목 선택 */}
        <div>
          <label className="text-xs text-gray-500 font-semibold">종목 선택</label>
          <select 
            value={exercise} 
            onChange={(e) => setExercise(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg text-sm font-semibold"
          >
            {EXERCISE_LIST[category]?.map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>

        {/* 수치 입력 */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div>
            <label className="text-xs text-gray-500 block text-center">무게 (kg)</label>
            <input 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded-lg text-center font-bold text-base"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block text-center">횟수 (회)</label>
            <input 
              type="number" 
              value={reps} 
              onChange={(e) => setReps(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded-lg text-center font-bold text-base"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block text-center">휴식 (초)</label>
            <input 
              type="number" 
              value={restTime} 
              onChange={(e) => setRestTime(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded-lg text-center font-bold text-base"
            />
          </div>
        </div>

        <button 
          onClick={handleAddSet}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg active:bg-blue-700 transition mt-2"
        >
          세트 추가하기
        </button>
      </div>

      {/* 기록된 세트 목록 */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="font-bold text-sm mb-3">오늘 기록된 세트 ({logs.length})</h2>
        {logs.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">아직 세트 기록이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log, index) => (
              <li key={index} className="flex justify-between items-center text-xs p-2.5 bg-slate-100 rounded-lg">
                <div>
                  <span className="text-[10px] text-blue-600 font-bold block">{log.category}</span>
                  <span className="font-bold text-gray-800">{log.exercise}</span>
                </div>
                <span className="text-gray-600 font-medium">
                  {log.weight}kg × {log.reps}회 <span className="text-gray-400">({log.restTime}초)</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}