import { ProgressChart, BackButton } from '../components/UI';
import exercises from '../data/exercises.json';

export default function ProgressPage({ appData, streak, onNavigate }) {
  const { data } = appData;
  const allHistory = [
    ...(data.workoutHistory || []).map(h => ({ ...h, type: 'workout' })),
    ...(data.recoveryHistory || []).map(h => ({ ...h, type: 'recovery' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalWorkouts = data.workoutHistory?.length || 0;
  const totalRecovery = data.recoveryHistory?.length || 0;
  const avgDuration = allHistory.length > 0
    ? Math.round(allHistory.reduce((s, h) => s + (h.duration || 0), 0) / allHistory.length)
    : 0;

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const mainDb = Object.fromEntries(exercises.main.map(e => [e.id, e]));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50/30">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <BackButton onClick={() => onNavigate('home')} />
          <h1 className="text-xl font-black text-gray-800 font-display">Your Progress</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { val: totalWorkouts, label: 'Workouts', color: 'text-teal-600' },
            { val: totalRecovery, label: 'Recovery', color: 'text-violet-600' },
            { val: `${streak}🔥`, label: 'Streak', color: 'text-orange-500' },
            { val: formatTime(avgDuration), label: 'Avg Time', color: 'text-blue-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 text-center border-2 border-gray-100">
              <div className={`text-lg font-black ${s.color}`}>{s.val}</div>
              <div className="text-gray-400 text-[10px]">{s.label}</div>
            </div>
          ))}
        </div>

        <ProgressChart history={allHistory} />

        {/* Weight Log */}
        {Object.keys(data.weights || {}).filter(k => data.weights[k]).length > 0 && (
          <div className="bg-white rounded-2xl p-4 mb-4 border-2 border-gray-100">
            <h3 className="font-semibold text-gray-700 text-sm mb-3">🏋️ Weight Log</h3>
            <div className="space-y-2">
              {Object.entries(data.weights).filter(([, v]) => v).map(([id, weight]) => {
                const ex = mainDb[id];
                return ex ? (
                  <div key={id} className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-[13px]">{ex.icon} {ex.name}</span>
                    <span className="font-bold text-teal-600 text-[13px]">{weight} lbs</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Pain Log */}
        {(data.pains || []).length > 0 && (
          <div className="bg-white rounded-2xl p-4 mb-4 border-2 border-amber-100">
            <h3 className="font-semibold text-gray-700 text-sm mb-3">⚠️ Pain Notes</h3>
            <div className="space-y-2">
              {[...(data.pains || [])].reverse().slice(0, 8).map((p, i) => (
                <div key={i} className="py-2 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 text-[13px]">{p.exercise}</span>
                    <span className="text-gray-400 text-[11px]">{new Date(p.date).toLocaleDateString()}</span>
                  </div>
                  {p.note && <p className="text-gray-500 text-[12px] mt-1">{p.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100">
          <h3 className="font-semibold text-gray-700 text-sm mb-3">📅 Session History</h3>
          {allHistory.length === 0 ? (
            <p className="text-gray-400 text-center py-4 text-[13px]">No sessions yet. Start your first one!</p>
          ) : (
            <div className="space-y-2">
              {allHistory.slice(0, 20).map((h, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="font-medium text-gray-700 text-[13px]">
                      {h.type === 'recovery' ? '🌙' : '💪'} {new Date(h.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-gray-400 text-[11px]">{h.day || h.program}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-teal-600 text-[13px] font-mono">{formatTime(h.duration)}</div>
                    <div className="text-gray-400 text-[11px]">{h.completed}/{h.total} sets</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
