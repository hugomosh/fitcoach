import { useState, useMemo } from 'react';
import { ExerciseCard, VideoModal, CoachBubble, BreathingGuide, BackButton } from '../components/UI';
import { useTimer } from '../hooks/useTimer';
import exercises from '../data/exercises.json';
import programsData from '../data/programs.json';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function RecoveryPage({ appData, onNavigate }) {
  const { data, logRecovery } = appData;
  const timer = useTimer();
  const weekKey = `week${data.currentWeek}`;
  const recoveryDays = programsData.recoveryProgram[weekKey] || programsData.recoveryProgram.week1;

  const [dayIndex, setDayIndex] = useState(null);
  const [setProgress, setSetProgress] = useState({});
  const [videoModal, setVideoModal] = useState(null);
  const [breathingActive, setBreathingActive] = useState(false);
  const [expandedSection, setExpandedSection] = useState(0);
  const [coachMsg, setCoachMsg] = useState('');
  const [finished, setFinished] = useState(false);

  const recoveryDb = Object.fromEntries(exercises.recovery.map(e => [e.id, e]));
  const dayPlan = dayIndex !== null ? recoveryDays[dayIndex] : null;

  const resolvedSections = useMemo(() => {
    if (!dayPlan) return [];
    return dayPlan.sections.map(s => ({
      ...s,
      resolvedExercises: s.exercises.map(id => recoveryDb[id]).filter(Boolean),
    }));
  }, [dayPlan]);

  const allExercises = resolvedSections.flatMap(s => s.resolvedExercises);
  const totalSets = allExercises.reduce((sum, e) => sum + (e.sets || 1), 0);
  const completedSets = Object.values(setProgress).reduce((sum, v) => sum + v, 0);
  const pct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const startDay = (idx) => {
    setDayIndex(idx);
    setSetProgress({});
    timer.reset();
    timer.start();
    setCoachMsg(pickRandom(programsData.coachMessages.recoveryStart));
    setExpandedSection(0);
    setFinished(false);
  };

  const toggleSet = (exerciseId, setIndex) => {
    setSetProgress(prev => {
      const current = prev[exerciseId] || 0;
      return { ...prev, [exerciseId]: setIndex < current ? setIndex : setIndex + 1 };
    });
  };

  const handleFinish = () => {
    timer.pause();
    logRecovery({ duration: timer.seconds, completed: completedSets, total: totalSets, day: dayPlan?.label });
    setCoachMsg(pickRandom(programsData.coachMessages.recoveryComplete));
    setFinished(true);
  };

  // ─── Day Picker ───
  if (dayIndex === null) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(170deg, #0f172a 0%, #1e293b 40%, #334155 100%)' }}>
        <div className="max-w-lg mx-auto px-5 py-8">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => onNavigate('home')} className="text-slate-500 hover:text-slate-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <h1 className="text-xl font-black text-white font-display">Evening Recovery</h1>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl mb-3" style={{ filter: 'drop-shadow(0 0 40px rgba(253,224,71,0.3))' }}>🌙</div>
            <p className="text-slate-400 text-sm">Physical Therapy-Style Wind Down</p>
          </div>

          <div className="space-y-3">
            {recoveryDays.map((day, i) => (
              <button key={i} onClick={() => startDay(i)} className="w-full text-left p-5 rounded-2xl transition-all hover:border-violet-500/30" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-white font-bold text-[15px] mb-2">{day.label}</div>
                <div className="flex flex-wrap gap-2">
                  {day.sections.map((s, j) => (
                    <span key={j} className="text-slate-500 text-[12px]">{s.icon} {s.name}</span>
                  ))}
                </div>
                <div className="text-slate-600 text-[11px] mt-2">{day.sections.reduce((sum, s) => sum + s.exercises.length, 0)} exercises</div>
              </button>
            ))}
          </div>

          <div className="px-4 py-4 rounded-xl mt-6" style={{ background: 'rgba(147,197,253,0.06)', border: '1px solid rgba(147,197,253,0.1)' }}>
            <p className="text-slate-400 text-[13px] leading-relaxed">
              <span className="text-blue-400 font-semibold">Designed for desk workers. </span>
              Release tight tissue → restore mobility → activate dormant muscles → deep stretch. Every exercise targets a specific dysfunction caused by prolonged sitting.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Finished ───
  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(170deg, #0f172a 0%, #1e293b 40%, #334155 100%)' }}>
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="text-6xl mb-6" style={{ filter: 'drop-shadow(0 0 30px rgba(253,224,71,0.3))' }}>✨</div>
          <h1 className="text-3xl font-black text-white font-display mb-3">Recovery Complete</h1>
          <p className="text-slate-400 text-[15px] mb-2">You gave your body {timer.format()} of dedicated care.</p>
          <div className="flex items-start gap-3 mb-6 justify-center">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white text-sm font-black flex-shrink-0">C</div>
            <div className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-4 py-3 rounded-2xl rounded-tl-sm max-w-[280px] text-sm leading-relaxed">{coachMsg}</div>
          </div>
          <div className="flex gap-3 justify-center mb-8">
            <div className="px-5 py-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="text-2xl font-black text-violet-400 font-mono">{timer.format()}</div>
              <div className="text-slate-500 text-[11px]">Duration</div>
            </div>
            <div className="px-5 py-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="text-2xl font-black text-emerald-400">{completedSets}/{totalSets}</div>
              <div className="text-slate-500 text-[11px]">Completed</div>
            </div>
          </div>
          <button onClick={() => onNavigate('home')} className="w-full py-4 rounded-2xl text-white font-semibold" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
            Done — Good Night 🌙
          </button>
        </div>
      </div>
    );
  }

  // ─── Active Recovery ───
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(170deg, #fafbfe 0%, #f1f0fb 40%, #ede9fe 100%)' }}>
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3 sticky top-0 z-10 py-2" style={{ background: 'linear-gradient(to bottom, #fafbfe 80%, transparent)' }}>
          <BackButton onClick={() => setDayIndex(null)} />
          <div className="flex items-center gap-2">
            <button onClick={() => setBreathingActive(!breathingActive)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${breathingActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
              {breathingActive ? '🫁 Breathing' : '🫁'}
            </button>
            <div className="font-black text-xl text-gray-700 font-mono">{timer.format()}</div>
          </div>
          <button onClick={pct >= 80 ? handleFinish : timer.toggle} className={`px-4 py-2 rounded-xl font-bold text-sm ${pct >= 80 ? 'bg-violet-500 text-white' : 'bg-violet-100 text-violet-600'}`}>
            {pct >= 80 ? 'END' : timer.running ? '⏸' : '▶'}
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-gray-500 font-semibold text-[12px]">{pct}%</span>
            <span className="text-gray-400 text-[12px]">{completedSets}/{totalSets}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #8b5cf6, #6366f1, #a78bfa)' }} />
          </div>
        </div>

        {coachMsg && <CoachBubble message={coachMsg} variant="night" />}
        <BreathingGuide active={breathingActive} />

        {/* Sections */}
        {resolvedSections.map((section, si) => {
          const isExpanded = expandedSection === si;
          const sectionDone = section.resolvedExercises.every(e => (setProgress[e.id] || 0) >= (e.sets || 1));

          return (
            <div key={si} className="mb-4">
              <button
                onClick={() => setExpandedSection(isExpanded ? null : si)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all text-left"
                style={{
                  background: sectionDone ? 'rgba(16,185,129,0.08)' : isExpanded ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.6)',
                  border: sectionDone ? '1px solid rgba(16,185,129,0.2)' : isExpanded ? '1px solid rgba(139,92,246,0.15)' : '1px solid rgba(0,0,0,0.04)',
                }}
              >
                <span className="text-xl">{sectionDone ? '✅' : section.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-gray-800 text-[15px]">{section.name}</div>
                  <div className="text-gray-400 text-[12px]">{section.resolvedExercises.length} exercises</div>
                </div>
                <svg className={`w-5 h-5 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {isExpanded && section.resolvedExercises.map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  section="recovery"
                  completed={setProgress[exercise.id] || 0}
                  totalSets={exercise.sets || 1}
                  onToggleSet={toggleSet}
                  onWeightChange={() => {}}
                  onVideoClick={(q, n) => setVideoModal({ query: q, name: n })}
                  showCues
                  weight={null}
                />
              ))}
            </div>
          );
        })}

        {pct >= 80 && (
          <button onClick={handleFinish} className="w-full py-4 rounded-2xl text-white font-bold text-lg mb-4" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            Complete Recovery ✨
          </button>
        )}
      </div>
      {videoModal && <VideoModal name={videoModal.name} query={videoModal.query} onClose={() => setVideoModal(null)} />}
    </div>
  );
}
