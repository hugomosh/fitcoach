import { CoachBubble } from '../components/UI';
import programs from '../data/programs.json';

const WEEK_LABELS = ['Week 1: Foundation', 'Week 2: Build'];

export default function HomePage({ appData, streak, onNavigate }) {
  const { data } = appData;
  const totalWorkouts = (data.workoutHistory?.length || 0) + (data.recoveryHistory?.length || 0);
  const program = programs.programs[data.currentWeek - 1] || programs.programs[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50/30">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight font-display">FitCoach</h1>
            <p className="text-teal-600 font-medium text-[13px]">Anti-Sedentary Training</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onNavigate('progress')} className="w-10 h-10 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-center text-gray-500 hover:border-teal-300 transition-colors">📊</button>
            <button onClick={() => onNavigate('settings')} className="w-10 h-10 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-center text-gray-500 hover:border-teal-300 transition-colors">⚙️</button>
          </div>
        </div>

        {/* Coach */}
        <CoachBubble message={streak > 0
          ? `${streak}-day streak! 🔥 You're building a habit that'll transform how your body feels.`
          : "Welcome! I'm your coach. Let's counter the effects of sitting and build a stronger you."
        } />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { val: totalWorkouts, label: 'Sessions', color: 'text-teal-600' },
            { val: `${streak}🔥`, label: 'Streak', color: 'text-orange-500' },
            { val: `W${data.currentWeek}`, label: 'Week', color: 'text-violet-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 text-center border-2 border-gray-100">
              <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
              <div className="text-gray-400 text-[11px]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Program Card */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-5 mb-6 text-white shadow-lg" style={{ boxShadow: '0 8px 30px rgba(20,184,166,0.3)' }}>
          <div className="text-xs font-semibold opacity-80 mb-1">CURRENT PROGRAM</div>
          <div className="text-lg font-bold mb-1">{program.name}</div>
          <div className="text-sm opacity-90 mb-4">{program.focus}</div>
          <div className="flex gap-2">
            {WEEK_LABELS.map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${i < data.currentWeek ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>

        {/* Main CTAs */}
        <button
          onClick={() => onNavigate('workout')}
          className="w-full py-5 rounded-2xl bg-gray-900 text-white font-bold text-lg shadow-xl hover:bg-gray-800 active:scale-[0.98] transition-all mb-3 font-display"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
        >
          Start Strength Workout 💪
        </button>
        <p className="text-center text-gray-400 text-[12px] mb-4">~35-50 min • Warm Up → Strength → Cool Down</p>

        <button
          onClick={() => onNavigate('recovery')}
          className="w-full py-5 rounded-2xl text-white font-bold text-lg shadow-xl active:scale-[0.98] transition-all mb-3 font-display"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 30px rgba(99,102,241,0.3)' }}
        >
          Evening Recovery 🌙
        </button>
        <p className="text-center text-gray-400 text-[12px] mb-6">~25-35 min • PT-style wind down</p>

        {/* Day Picker */}
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 mb-4">
          <h3 className="font-bold text-gray-800 text-[15px] mb-3">📅 This Week's Schedule</h3>
          <div className="space-y-2">
            {program.days.map((day, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-sm">D{day.day}</div>
                <div>
                  <div className="font-medium text-gray-700 text-[13px]">{day.label}</div>
                  <div className="text-gray-400 text-[11px]">{day.main.length} exercises + warm up & cool down</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What We Target */}
        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 mb-4">
          <h3 className="font-bold text-gray-800 text-[15px] mb-3">🎯 What We Target</h3>
          <div className="space-y-2">
            {[
              { label: 'Posterior Chain', desc: 'Glutes, hamstrings — dormant from sitting', color: 'bg-rose-100 text-rose-700' },
              { label: 'Upper Back & Posture', desc: 'Reverse forward head & rounded shoulders', color: 'bg-blue-100 text-blue-700' },
              { label: 'Core Stability', desc: 'Deep stabilizers weakened by chair support', color: 'bg-amber-100 text-amber-700' },
              { label: 'Hip Mobility', desc: 'Tight flexors from 8+ hours sitting', color: 'bg-purple-100 text-purple-700' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`${item.color} px-2 py-0.5 rounded-md font-semibold flex-shrink-0 text-[11px]`}>{item.label}</span>
                <span className="text-gray-500 text-[12px]">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onNavigate('progress')} className="p-4 rounded-2xl bg-white border-2 border-gray-100 text-left hover:border-teal-200 transition-colors">
            <div className="text-xl mb-1">📈</div>
            <div className="font-semibold text-gray-700 text-[13px]">View Progress</div>
            <div className="text-gray-400 text-[11px]">Track your journey</div>
          </button>
          <button onClick={() => onNavigate('settings')} className="p-4 rounded-2xl bg-white border-2 border-gray-100 text-left hover:border-teal-200 transition-colors">
            <div className="text-xl mb-1">📦</div>
            <div className="font-semibold text-gray-700 text-[13px]">Import / Export</div>
            <div className="text-gray-400 text-[11px]">Share or backup data</div>
          </button>
        </div>
      </div>
    </div>
  );
}
