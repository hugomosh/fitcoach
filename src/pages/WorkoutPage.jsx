import { useState, useMemo } from 'react';
import { ExerciseCard, VideoModal, PainModal, CoachBubble, BackButton } from '../components/UI';
import { useTimer } from '../hooks/useTimer';
import exercises from '../data/exercises.json';
import programsData from '../data/programs.json';

function resolveExercises(ids, db) {
  return ids.map(id => db.find(e => e.id === id)).filter(Boolean);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function WorkoutPage({ appData, onNavigate }) {
  const { data, setWeight, addPain, logWorkout } = appData;
  const timer = useTimer();

  const program = programsData.programs[data.currentWeek - 1] || programsData.programs[0];
  const [dayIndex, setDayIndex] = useState(null);
  const [setProgress, setSetProgress] = useState({});
  const [videoModal, setVideoModal] = useState(null);
  const [painModal, setPainModal] = useState(null);
  const [coachMsg, setCoachMsg] = useState('');
  const [finished, setFinished] = useState(false);

  const dayPlan = dayIndex !== null ? program.days[dayIndex] : null;

  const workout = useMemo(() => {
    if (!dayPlan) return null;
    const allEx = { ...Object.fromEntries([...exercises.warmup, ...exercises.main, ...exercises.cooldown].map(e => [e.id, e])) };
    return {
      warmup: dayPlan.warmup.map(id => allEx[id]).filter(Boolean),
      main: dayPlan.main.map(id => allEx[id]).filter(Boolean),
      cooldown: dayPlan.cooldown.map(id => allEx[id]).filter(Boolean),
    };
  }, [dayPlan]);

  const startDay = (idx) => {
    setDayIndex(idx);
    setSetProgress({});
    timer.reset();
    timer.start();
    setCoachMsg(pickRandom(programsData.coachMessages.start));
    setFinished(false);
  };

  const toggleSet = (exerciseId, setIndex) => {
    setSetProgress(prev => {
      const current = prev[exerciseId] || 0;
      const next = setIndex < current ? setIndex : setIndex + 1;
      return { ...prev, [exerciseId]: next };
    });
  };

  const handleFinish = () => {
    timer.pause();
    const allEx = [...(workout?.warmup || []), ...(workout?.main || []), ...(workout?.cooldown || [])];
    const totalSets = allEx.reduce((s, e) => s + (e.sets || 1), 0);
    const completed = Object.values(setProgress).reduce((s, v) => s + v, 0);
    logWorkout({ duration: timer.seconds, completed, total: totalSets, program: program.name, day: dayPlan?.label });
    setCoachMsg(pickRandom(programsData.coachMessages.complete));
    setFinished(true);
  };

  // ─── Day Picker ───
  if (dayIndex === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50/30">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <BackButton onClick={() => onNavigate('home')} />
            <h1 className="text-xl font-black text-gray-800 font-display">Choose Workout Day</h1>
          </div>
          <p className="text-gray-500 text-sm mb-4">{program.name} — {program.focus}</p>
          <div className="space-y-3">
            {program.days.map((day, i) => {
              const mainExercises = day.main.map(id => exercises.main.find(e => e.id === id)).filter(Boolean);
              return (
                <button key={i} onClick={() => startDay(i)} className="w-full text-left p-5 rounded-2xl bg-white border-2 border-gray-100 hover:border-teal-300 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-black">D{day.day}</div>
                    <div>
                      <div className="font-bold text-gray-800 text-[15px]">{day.label}</div>
                      <div className="text-gray-400 text-[12px]">{day.warmup.length + day.main.length + day.cooldown.length} exercises</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 ml-13">
                    {mainExercises.map(ex => (
                      <span key={ex.id} className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 text-[11px]">{ex.icon} {ex.muscle}</span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── Finished ───
  if (finished) {
    const allEx = [...(workout?.warmup || []), ...(workout?.main || []), ...(workout?.cooldown || [])];
    const totalSets = allEx.reduce((s, e) => s + (e.sets || 1), 0);
    const completed = Object.values(setProgress).reduce((s, v) => s + v, 0);
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-black text-gray-800 font-display mb-2">Workout Complete!</h1>
          <CoachBubble message={coachMsg} variant="success" />
          <div className="grid grid-cols-2 gap-3 my-6">
            <div className="bg-white rounded-2xl p-4 border-2 border-emerald-200">
              <div className="text-2xl font-black text-teal-600 font-mono">{timer.format()}</div>
              <div className="text-gray-400 text-[12px]">Duration</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-emerald-200">
              <div className="text-2xl font-black text-emerald-600">{completed}/{totalSets}</div>
              <div className="text-gray-400 text-[12px]">Sets Done</div>
            </div>
          </div>
          <button onClick={() => onNavigate('home')} className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-lg mb-3">Back to Home</button>
          <button onClick={() => onNavigate('recovery')} className="w-full py-4 rounded-2xl border-2 border-violet-200 text-violet-600 font-bold text-lg">Evening Recovery 🌙</button>
        </div>
      </div>
    );
  }

  // ─── Active Workout ───
  const sections = [
    { key: 'warmup', title: '🔥 Warm Up', subtitle: 'Activate & mobilize', exercises: workout?.warmup || [] },
    { key: 'main', title: '💪 Main Workout', subtitle: 'Strength & anti-sedentary', exercises: workout?.main || [] },
    { key: 'cooldown', title: '🧊 Cool Down', subtitle: 'Stretch & recover', exercises: workout?.cooldown || [] },
  ];
  const allEx = sections.flatMap(s => s.exercises);
  const totalSets = allEx.reduce((s, e) => s + (e.sets || 1), 0);
  const completedSets = Object.values(setProgress).reduce((s, v) => s + v, 0);
  const pct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50/30">
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-gradient-to-b from-slate-50 to-slate-50/0 pt-2 pb-4 z-10">
          <BackButton onClick={() => setDayIndex(null)} />
          <div className="font-black text-2xl text-gray-800 font-mono">{timer.format()}</div>
          <button onClick={handleFinish} className="px-4 py-2 rounded-xl bg-teal-500 text-white font-bold text-sm">END</button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 font-semibold text-[12px]">{pct}% Complete</span>
            <span className="text-gray-400 text-[12px]">{completedSets}/{totalSets} sets</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {coachMsg && <CoachBubble message={coachMsg} />}

        <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-700 font-semibold text-[12px] mb-4">
          ⚡ {dayPlan?.label}
        </div>

        {sections.map(section => (
          <div key={section.key} className="mb-6">
            <div className="flex items-baseline gap-2 mb-3">
              <h2 className="font-bold text-gray-800 text-[17px]">{section.title}</h2>
              <span className="text-gray-400 text-[12px]">{section.subtitle}</span>
            </div>
            {section.exercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                section={section.key}
                completed={setProgress[exercise.id] || 0}
                totalSets={exercise.sets || 1}
                onToggleSet={toggleSet}
                onWeightChange={(id, val) => setWeight(id, val)}
                onFlagPain={(id, name) => setPainModal({ id, name })}
                onVideoClick={(q, n) => setVideoModal({ query: q, name: n })}
                weight={data.weights[exercise.id]}
              />
            ))}
          </div>
        ))}
      </div>
      {videoModal && <VideoModal name={videoModal.name} query={videoModal.query} onClose={() => setVideoModal(null)} />}
      {painModal && <PainModal exerciseName={painModal.name} onSave={(note) => { addPain({ exercise: painModal.name, exerciseId: painModal.id, note }); setPainModal(null); }} onClose={() => setPainModal(null)} />}
    </div>
  );
}
