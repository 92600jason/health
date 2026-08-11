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

interface LogSet {
  id: string;
  date: string;
  splitDay: string;
  category: string;
  exercise: string;
  weight: number;
  reps: number;
  restTime: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'log' | 'routine' | 'calendar'>('log');
  
  // 날짜 설정
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // 분할 방식 및 분할별 등록된 종목 (Day1, Day2 ...)
  const [splitCount, setSplitCount] = useState<number>(3); // 기본 3분할
  const [splitRoutines, setSplitRoutines] = useState<Record<string, string[]>>({
    'Day 1 (가슴/삼두)': ['바벨 벤치프레스 (프리)', '케이블 트라이셉스 푸시다운 (바)'],
    'Day 2 (등/이두)': ['랫풀다운 (머신)', '바벨 컬 (프리)'],
    'Day 3 (하체/어깨)': ['바벨 백 스쿼트 (프리)', '덤벨 숄더 프레스 (프리)'],
  });

  const [currentDay, setCurrentDay] = useState<string>('Day 1 (가슴/삼두)');

  // 루틴 설정 탭용 입력 상태
  const [setupDay, setSetupDay] = useState<string>('Day 1 (가슴/삼두)');
  const [setupCategory, setSetupCategory] = useState<string>('가슴');
  const [setupExercise, setSetupExercise] = useState<string>(EXERCISE_LIST['가슴'][0]);

  // 기록 입력 상태
  const [category, setCategory] = useState<string>('가슴');
  const [exercise, setExercise] = useState<string>(EXERCISE_LIST['가슴'][0]);
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(15);
  const [restTime, setRestTime] = useState(45);

  // 전체 기록
  const [logs, setLogs] = useState<LogSet[]>([]);

  // 분할 수 변경 시 기본 Day 세팅 생성
  const handleSplitCountChange = (count: number) => {
    setSplitCount(count);
    const newRoutines: Record<string, string[]> = {};
    for (let i = 1; i <= count; i++) {
      const dayKey = `Day ${i}`;
      newRoutines[dayKey] = splitRoutines[dayKey] || [];
    }
    setSplitRoutines(newRoutines);
    const firstKey = Object.keys(newRoutines)[0];
    setCurrentDay(firstKey);
    setSetupDay(firstKey);
  };

  // 루틴에 종목 추가
  const handleAddExerciseToRoutine = () => {
    const currentList = splitRoutines[setupDay] || [];
    if (!currentList.includes(setupExercise)) {
      setSplitRoutines({
        ...splitRoutines,
        [setupDay]: [...currentList, setupExercise]
      });
    }
  };

  // 루틴에서 종목 삭제
  const handleRemoveExerciseFromRoutine = (dayKey: string, exName: string) => {
    setSplitRoutines({
      ...splitRoutines,
      [dayKey]: splitRoutines[dayKey].filter(e => e !== exName)
    });
  };

  // 부위 변경 처리
  const handleCategoryChange = (newCategory: string, isSetup = false) => {
    if (isSetup) {
      setSetupCategory(newCategory);
      setSetupExercise(EXERCISE_LIST[newCategory][0]);
    } else {
      setCategory(newCategory);
      setExercise(EXERCISE_LIST[newCategory][0]);
    }
  };

  // 세트 추가
  const handleAddSet = () => {
    const newSet: LogSet = {
      id: Date.now().toString(),
      date: selectedDate,
      splitDay: currentDay,
      category,
      exercise,
      weight,
      reps,
      restTime
    };
    setLogs([...logs, newSet]);
  };

  const handleDeleteSet = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  const currentDayLogs = logs.filter(log => log.date === selectedDate);
  const loggedDates = Array.from(new Set(logs.map(log => log.date)));

  return (
    <main className="max-w-md mx-auto p-4 min-h-screen bg-slate-50 text-slate-900 pb-12">
      <h1 className="text-2xl font-bold mb-4 text-center">🏋️ Gym Tracker</h1>

      {/* 탭 네비게이션 */}
      <div className="flex bg-slate-200 p-1 rounded-xl mb-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('log')}
          className={`flex-1 py-2 rounded-lg transition ${activeTab === 'log' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          📝 운동 기록
        </button>
        <button
          onClick={() => setActiveTab('routine')}
          className={`flex-1 py-2 rounded-lg transition ${activeTab === 'routine' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          ⚙️ 분할/종목 설정
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 py-2 rounded-lg transition ${activeTab === 'calendar' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          📅 달력 보기
        </button>
      </div>

      {activeTab === 'log' && (
        <>
          {/* 날짜 & 분할 선택 */}
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
                <label className="text-xs font-semibold text-gray-500">오늘 할 분할 Day</label>
                <select 
                  value={currentDay} 
                  onChange={(e) => setCurrentDay(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg bg-gray-50 text-sm font-bold text-blue-600"
                >
                  {Object.keys(splitRoutines).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 현재 선택된 Day에 설정된 종목 퀵 선택 */}
            {splitRoutines[currentDay]?.length > 0 && (
              <div className="pt-1">
                <label className="text-[11px] text-gray-400 block mb-1">💡 {currentDay} 지정 종목 (클릭 시 자동 선택)</label>
                <div className="flex flex-wrap gap-1">
                  {splitRoutines[currentDay].map(ex => (
                    <button
                      key={ex}
                      onClick={() => setExercise(ex)}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium border ${exercise === ex ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 세트 입력 폼 */}
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
                className="w-full mt-1 p-2 border rounded-lg text-sm font-bold text-slate-800"
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

          {/* 당일 기록 */}
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
                      <span className="text-[10px] text-blue-600 font-bold block">{log.splitDay} • {log.category}</span>
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
      )}

      {activeTab === 'routine' && (
        <div className="space-y-4">
          {/* 분할 설정 */}
          <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
            <h2 className="font-bold text-sm">1. 몇 분할로 진행할까요?</h2>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => handleSplitCountChange(num)}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm ${splitCount === num ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  {num}분할
                </button>
              ))}
            </div>
          </div>

          {/* 분할 Day별 종목 구성 */}
          <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
            <h2 className="font-bold text-sm">2. 분할별 종목 구성하기</h2>
            
            <div>
              <label className="text-xs text-gray-500 font-semibold">설정할 Day</label>
              <select
                value={setupDay}
                onChange={(e) => setSetupDay(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg bg-gray-50 text-sm font-bold"
              >
                {Object.keys(splitRoutines).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 font-semibold">부위</label>
                <select
                  value={setupCategory}
                  onChange={(e) => handleCategoryChange(e.target.value, true)}
                  className="w-full mt-1 p-2 border rounded-lg text-xs"
                >
                  {Object.keys(EXERCISE_LIST).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-semibold">종목 선택</label>
                <select
                  value={setupExercise}
                  onChange={(e) => setSetupExercise(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg text-xs font-semibold"
                >
                  {EXERCISE_LIST[setupCategory]?.map(ex => (
                    <option key={ex} value={ex}>{ex}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleAddExerciseToRoutine}
              className="w-full py-2 bg-slate-800 text-white text-xs font-bold rounded-lg"
            >
              + {setupDay}에 종목 추가
            </button>
          </div>

          {/* 현재 구성된 분할별 루틴 확인 */}
          <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
            <h2 className="font-bold text-sm">내 분할 루틴 목록</h2>
            {Object.keys(splitRoutines).map(day => (
              <div key={day} className="border p-3 rounded-lg bg-slate-50">
                <span className="font-bold text-xs text-blue-600 block mb-2">{day}</span>
                {splitRoutines[day]?.length === 0 ? (
                  <p className="text-[11px] text-gray-400">지정된 종목이 없습니다.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {splitRoutines[day].map(ex => (
                      <span key={ex} className="text-xs bg-white border px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                        {ex}
                        <button
                          onClick={() => handleRemoveExerciseFromRoutine(day, ex)}
                          className="text-red-400 text-xs ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="font-bold text-sm mb-3">📅 날짜 선택</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-50 text-sm font-bold mb-3"
            />
            
            <div className="text-xs text-gray-500 mb-2 font-semibold">
              💡 운동한 날짜 목록:
            </div>
            {loggedDates.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">아직 기록이 없습니다.</p>
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
                      <span className="text-[10px] text-gray-500 block">{log.splitDay} • {log.category}</span>
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