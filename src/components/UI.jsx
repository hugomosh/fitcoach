import { useState } from 'react';

// ─── Coach Bubble ───
export function CoachBubble({ message, variant = 'default' }) {
  const bg = {
    default: 'from-teal-500 to-emerald-600',
    success: 'from-amber-500 to-orange-500',
    night: 'from-indigo-500 to-violet-600',
    warning: 'from-rose-500 to-pink-500',
  }[variant] || 'from-teal-500 to-emerald-600';

  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-lg">
        C
      </div>
      <div className={`bg-gradient-to-r ${bg} text-white px-4 py-3 rounded-2xl rounded-tl-sm max-w-[280px] shadow-md text-sm leading-relaxed`}>
        {message}
      </div>
    </div>
  );
}

// ─── Exercise Card ───
export function ExerciseCard({ exercise, section, completed, totalSets, onToggleSet, onWeightChange, onFlagPain, onVideoClick, weight, showCues = false }) {
  const [expanded, setExpanded] = useState(false);
  const sets = totalSets || exercise.sets || 1;
  const done = completed >= sets;

  return (
    <div className={`rounded-2xl mb-3 overflow-hidden transition-all duration-300 ${done ? 'border-2 border-emerald-200 bg-emerald-50/60' : 'border-2 border-gray-100 bg-white'}`}>
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">{exercise.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-gray-800 text-[15px] leading-tight">{exercise.name}</h4>
              {done && (
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </div>
            <p className="text-gray-400 text-[13px] mt-0.5">
              {exercise.muscle && <span>{exercise.muscle} • </span>}
              {exercise.reps ? `${exercise.reps} reps` : exercise.duration}
              {sets > 1 && ` • ${sets} sets`}
            </p>
          </div>
          <svg className={`w-4 h-4 text-gray-300 transition-transform mt-1 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>

        {/* Set bars */}
        <div className="flex items-center gap-2 mt-3 ml-9">
          <div className="flex gap-1.5 flex-1">
            {Array.from({ length: sets }).map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); onToggleSet(exercise.id, i); }}
                className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${i < completed ? 'bg-gradient-to-r from-teal-400 to-emerald-500' : 'bg-gray-200 hover:bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="px-4 pb-4 ml-9 space-y-2 animate-fadeIn">
          {/* Cue */}
          {(showCues || exercise.cue) && exercise.cue && (
            <div className="rounded-xl p-3 bg-blue-50/60 border border-blue-100">
              <p className="text-gray-600 text-[13px] leading-relaxed">
                <span className="font-semibold text-blue-500">Form cue: </span>{exercise.cue}
              </p>
            </div>
          )}
          {exercise.why && (
            <div className="rounded-xl p-3 bg-violet-50/40 border border-violet-100">
              <p className="text-gray-500 text-[12px] leading-relaxed">
                <span className="font-semibold text-violet-500">Why: </span>{exercise.why}
              </p>
            </div>
          )}

          {/* Weight */}
          {exercise.weight && section === 'main' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Weight:</span>
              <input
                type="number"
                value={weight || ''}
                onChange={(e) => { e.stopPropagation(); onWeightChange(exercise.id, e.target.value); }}
                onClick={(e) => e.stopPropagation()}
                placeholder="lbs"
                className="w-16 px-2 py-1 text-xs rounded-lg border border-gray-200 focus:border-teal-400 focus:outline-none"
              />
              <span className="text-xs text-gray-400">lbs</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onVideoClick(exercise.videoQuery, exercise.name); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-[12px] font-semibold"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z"/></svg>
              YouTube
            </button>
            {section === 'main' && onFlagPain && (
              <button
                onClick={(e) => { e.stopPropagation(); onFlagPain(exercise.id, exercise.name); }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors text-[12px] font-semibold"
              >
                ⚠️ Pain
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Video Modal ───
export function VideoModal({ name, query, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">{name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="flex flex-col gap-2">
          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z"/></svg>
            </div>
            <div>
              <div className="font-semibold text-red-700 text-sm">YouTube</div>
              <div className="text-red-400 text-xs">Form tutorials & demos</div>
            </div>
          </a>
          <a href={`https://www.instagram.com/explore/tags/${encodeURIComponent(query.replace(/\s+/g, ''))}/`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </div>
            <div>
              <div className="font-semibold text-purple-700 text-sm">Instagram</div>
              <div className="text-purple-400 text-xs">Reels & tips</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Pain Modal ───
export function PainModal({ exerciseName, onSave, onClose }) {
  const [note, setNote] = useState('');
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 pb-8" onClick={e => e.stopPropagation()}>
        <h3 className="font-bold text-gray-800 mb-2">⚠️ Flag Pain: {exerciseName}</h3>
        <p className="text-gray-500 text-[13px] mb-4">Describe what you're feeling so we can track patterns:</p>
        <textarea
          className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none resize-none text-sm"
          rows={3}
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g., Sharp pain in left knee during the movement..."
        />
        <div className="flex gap-2 mt-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm">Cancel</button>
          <button onClick={() => onSave(note)} className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-semibold text-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Breathing Guide ───
export function BreathingGuide({ active }) {
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(4);

  useState(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          setPhase(p => {
            const next = p === 'inhale' ? 'exhale' : 'inhale';
            return next;
          });
          return phase === 'inhale' ? 6 : 4;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active, phase]);

  if (!active) return null;

  return (
    <div className={`flex items-center justify-center gap-3 py-3 px-4 rounded-2xl mb-4 transition-colors duration-1000 ${phase === 'inhale' ? 'bg-blue-50/50' : 'bg-violet-50/50'}`}>
      <div className={`w-4 h-4 rounded-full transition-all duration-1000 ${phase === 'inhale' ? 'bg-blue-400 scale-125' : 'bg-violet-400 scale-75'}`} />
      <span className={`text-sm font-medium ${phase === 'inhale' ? 'text-blue-500' : 'text-violet-500'}`}>
        {phase === 'inhale' ? 'Breathe in...' : 'Breathe out...'} {count}
      </span>
    </div>
  );
}

// ─── Progress Chart ───
export function ProgressChart({ history, label = 'sets' }) {
  if (!history || history.length < 2) return null;
  const last10 = history.slice(-10);
  const maxVal = Math.max(...last10.map(h => h.completed || 0), 1);

  return (
    <div className="bg-white rounded-2xl p-4 mb-4 border-2 border-gray-100">
      <h3 className="font-semibold text-gray-700 text-sm mb-3">📈 Recent Sessions</h3>
      <div className="flex items-end gap-1.5" style={{ height: 80 }}>
        {last10.map((h, i) => {
          const height = ((h.completed || 0) / maxVal) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-md bg-gradient-to-t from-teal-500 to-emerald-400 transition-all" style={{ height: `${Math.max(height, 4)}%`, minHeight: 3 }} />
              <span className="text-gray-400 text-[9px]">{new Date(h.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Back Button ───
export function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="text-gray-400 hover:text-gray-600">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
  );
}
