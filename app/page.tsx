'use client';

import { useState } from 'react';

// 부위별 운동 데이터베이스
const EXERCISE_LIST: Record<string, string[]> = {
  가슴: [
    '바벨 벤치프레스 (프리)', '덤벨 벤치프레스 (프리)', '인클라인 바벨 벤치프레스 (프리)', '인클라인 덤벨 벤치프레스 (프리)',
    '스미스 머신 플랫 벤치프레스', '스미스 머신 인클라인 벤치프레스', '스미스 머신 디클라인 벤치프레스',
    '체스트 프레스 머신 (머신)', '인클라인 체스트 프레스 머신 (머신)', '펙덱 플라이 머신 (머신)',
    '케이블 크로스오버 (케이블)', '푸시업 (맨몸)', '딥스 (가슴 자극) (맨몸)'
  ],
  등: [
    '컨벤셔널 데드리프트 (프리)', '루마니안 데드리프트 (프리)', '바벨 벤트오버 로우 (프리)', '원암 덤벨 로우 (프리)',
    '스미스 머신 바벨 로우',
    '랫풀다운 (머신)', '시티드 케이블 로우 (머신)', '어시스트 풀업 머신 (머신)',
    '케이블 암 풀다운 (케이블)', '풀업 (턱걸이) (맨몸)'
  ],
  어깨: [
    '오버헤드 프레스 (OHP) (프리)', '덤벨 숄더 프레스 (프리)', '덤벨 사이드 레터럴 레이즈 (프리)',
    '스미스 머신 숄더 프레스',
    '숄더 프레스 머신 (머신)', '리버스 펙덱 플라이 (후면) (머신)',
    '케이블 사이드 레터럴 레이즈 (케이블)'
  ],
  하체: [
    '바벨 백 스쿼트 (프리)', '덤벨 고블렛 스쿼트 (프리)', '바벨 런지 (프리)',
    '스미스 머신 스쿼트', '스미스 머신 런지', '스미스 머신 스플릿 스쿼트',
    '레그 프레스 (머신)', '레그 익스텐션 (머신)', '라이잉 레그 컬 (머신)', '이너 쓰아이/아웃타이 머신 (머신)'
  ],
  삼두: [
    '라잉 트라이셉스 익스텐션 (프리)', '덤벨 오버헤드 익스텐션 (프리)',
    '케이블 트라이셉스 푸시다운 (바)', '케이블 트라이셉스 푸시다운 (로프)'
  ],
  이두: [
    '바벨 컬 (프리)', '덤벨 컬 (프리)', '덤벨 해머 컬 (프리)',
    '암 컬 머신 (머신)', '케이블 바벨 컬 (케이블)'
  ],
  '복근 / 기타': [
    '행잉 레그 레이즈', '크런치', '플랭크', '케이블 크런치', '악력기 훈련'
  ]
};

// 프리셋 루틴 구조
interface Routine {
  id: string;
  name: string;
  targetCategories: string[];
}

const DEFAULT_ROUTINES: Routine[] = [
  { id: '1', name: '상체 A (가슴 + 삼두)', targetCategories: ['가슴', '삼두'] },
  { id: '2', name: '하체 & 등 (당기기 + 이두)', targetCategories: ['하체', '등', '이두'] },
  { id: '3', name: '상체 B (어깨 + 가슴)', targetCategories: ['어깨', '가슴'] },
];

interface LogSet {
  id: string;
  date: string; // YYYY-MM-DD
  routineName: string;
  category: string;
  exercise: string;
  weight: number;
  reps: number;
  restTime: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'log' | 'calendar'>('log');
  
  // 오늘 날짜 기본값 (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // 루틴 상태
  const [routines] = useState<Routine[]>(DEFAULT_ROUTINES);
  const [selectedRoutine, setSelectedRoutine] = useState<string>(DEFAULT_ROUTINES[0].name);

  // 운동 입력 상태
  const [category, setCategory] = useState<string>('가슴');
  const [exercise, setExercise] = useState<string>(EXERCISE_LIST['가슴'][0]);
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(15);
  const [restTime, setRestTime] = useState(45);

  // 전체 기록 상태 (날짜별 저장)
  const [logs, setLogs] = useState<LogSet[]>([]);

  // 부위 변경 처리
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    if (EXERCISE_LIST[newCategory]) {
      setExercise(EXERCISE_LIST[newCategory][0]);
    }
  };

  // 세트 추가
  const handleAddSet = () => {
    const newSet: LogSet = {
      id: Date.now().toString(),
      date: selectedDate,
      routineName: selectedRoutine,
      category,
      exercise,
      weight,
      reps,
      restTime
    };
    setLogs([...logs, newSet]);
  };

  // 세트 삭제
  const handleDeleteSet = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  // 선택된 날짜의 기록 필터링
  const currentDayLogs = logs.filter(log => log.date === selectedDate);

  // 기록이 존재하는 날짜들 (달력 표시용)
  const loggedDates = Array.from(new Set(logs.map(log => log.date)));

  return (
    <main className="max-w-md mx-auto p-4 min-h-screen bg-slate-50 text-slate-900 pb-12">
      <h1 className="text-2xl font-bold mb-4 text-center">🏋️ Gym Tracker</h1>

      {/* 상단 탭 전환 */}
      <div className="flex bg-slate-200 p-1 rounded-xl mb-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('log')}
          className={`flex-1 py-2 rounded-lg transition ${activeTab === 'log' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600'}`}
        >
          📝 기록하기
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 py-2 rounded-lg transition ${activeTab === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600'}`}
        >
          📅 달력 / 일지
        </button>
      </div>

      {activeTab === 'log' ? (
        <>
          {/* 날짜 & 루틴 선택 */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-500">운동 날짜</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg bg-gray-50 text-sm font-bold"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-500">오늘의 루틴</label>
                <select 
                  value={selectedRoutine} 
                  onChange={(e) => setSelectedRoutine(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg bg-gray-50 text-sm font-bold"
                >
                  {routines.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 운동 세트 입력 폼 */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-4 space-y-3">
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

          {/* 선택한 날짜 기록 목록 */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="font-bold text-sm mb-3">
              📌 {selectedDate} 기록 ({currentDayLogs.length}세트)
            </h2>
            {currentDayLogs.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">선택한 날짜에 기록된 운동이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {currentDayLogs.map((log) => (
                  <li key={log.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-100 rounded-lg">
                    <div>
                      <span className="text-[10px] text-blue-600 font-bold block">{log.category} • {log.routineName}</span>
                      <span className="font-bold text-gray-800">{log.exercise}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">
                        {log.weight}kg × {log.reps}회 <span className="text-gray-400">({log.restTime}초)</span>
                      </span>
                      <button 
                        onClick={() => handleDeleteSet(log.id)}
                        className="text-red-400 hover:text-red-600 text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        /* 달력/일지 탭 */
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="font-bold text-sm mb-3">📅 날짜 선택</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-50 text-sm font-bold mb-3"
            />
            
            <div className="text-xs text-gray-500 mb-2">
              💡 <b>운동한 날짜 목록:</b>
            </div>
            {loggedDates.length === 0 ? (
              <p className="text-xs text-gray-400">아직 등록된 전체 운동 기록이 없습니다.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {loggedDates.sort().map(d => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDate(d);
                      setActiveTab('log');
                    }}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${d === selectedDate ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 특정 날짜 상세 기록 보기 */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="font-bold text-sm mb-3">📋 {selectedDate} 운동 상세</h2>
            {currentDayLogs.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">해당 날짜의 기록이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {currentDayLogs.map((log) => (
                  <li key={log.id} className="text-xs p-2.5 bg-slate-100 rounded-lg flex justify-between">
                    <div>
                      <span className="font-bold text-gray-800">{log.exercise}</span>
                      <span className="text-[10px] text-gray-500 block">{log.category}</span>
                    </div>
                    <span className="font-semibold text-slate-700">
                      {log.weight}kg × {log.reps}회
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </main>
  );
}