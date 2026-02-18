import { useState } from 'react';
import { BackButton } from '../components/UI';
import exercises from '../data/exercises.json';
import programsData from '../data/programs.json';

export default function SettingsPage({ appData, onNavigate }) {
  const { data, setWeek, exportAll, importData, resetAll } = appData;
  const [importModal, setImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  const totalExercises = exercises.warmup.length + exercises.main.length + exercises.cooldown.length + exercises.recovery.length;
  const program = programsData.programs[data.currentWeek - 1] || programsData.programs[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50/30">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <BackButton onClick={() => onNavigate('home')} />
          <h1 className="text-xl font-black text-gray-800 font-display">Settings</h1>
        </div>

        {/* Program Week */}
        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 mb-4">
          <h3 className="font-bold text-gray-800 text-[15px] mb-3">📅 Program Week</h3>
          <div className="flex items-center gap-4 mb-3">
            <button onClick={() => setWeek(data.currentWeek - 1)} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-200">−</button>
            <div className="text-3xl font-black text-teal-600 flex-1 text-center">Week {data.currentWeek}</div>
            <button onClick={() => setWeek(data.currentWeek + 1)} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-200">+</button>
          </div>
          <p className="text-gray-500 text-center text-[12px]">{program.name} — {program.focus}</p>
        </div>

        {/* Exercise DB */}
        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 mb-4">
          <h3 className="font-bold text-gray-800 text-[15px] mb-1">📚 Exercise Database</h3>
          <p className="text-gray-400 text-[12px] mb-3">{totalExercises} exercises for sedentary muscle imbalances</p>
          <div className="space-y-1">
            {[
              { label: 'Warm Up & Mobility', count: exercises.warmup.length },
              { label: 'Strength & Activation', count: exercises.main.length },
              { label: 'Cool Down & Stretch', count: exercises.cooldown.length },
              { label: 'Recovery / PT', count: exercises.recovery.length },
            ].map((cat, i) => (
              <div key={i} className="flex justify-between py-1">
                <span className="text-gray-600 text-[13px]">{cat.label}</span>
                <span className="text-teal-600 font-semibold text-[13px]">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Programs */}
        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 mb-4">
          <h3 className="font-bold text-gray-800 text-[15px] mb-3">🗓️ Available Programs</h3>
          <div className="space-y-3">
            {programsData.programs.map((p, i) => (
              <div key={i} className={`p-3 rounded-xl border-2 transition-colors ${data.currentWeek === i + 1 ? 'border-teal-300 bg-teal-50/30' : 'border-gray-100'}`}>
                <div className="font-semibold text-gray-800 text-[14px]">{p.name}</div>
                <div className="text-gray-500 text-[12px]">{p.focus}</div>
                <div className="text-gray-400 text-[11px] mt-1">{p.days.length} workout days • Difficulty {p.difficulty}/3</div>
              </div>
            ))}
            <div className="p-3 rounded-xl border-2 border-violet-100 bg-violet-50/20">
              <div className="font-semibold text-violet-700 text-[14px]">🌙 Evening Recovery</div>
              <div className="text-violet-500 text-[12px]">{Object.values(programsData.recoveryProgram).flat().length} sessions across both weeks</div>
            </div>
          </div>
        </div>

        {/* Import / Export */}
        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 mb-4">
          <h3 className="font-bold text-gray-800 text-[15px] mb-3">📦 Import / Export</h3>
          <p className="text-gray-400 text-[12px] mb-3">Backup your data or share progress with a friend</p>
          <div className="flex gap-2">
            <button onClick={() => setImportModal(true)} className="flex-1 py-3 rounded-xl bg-teal-50 text-teal-700 font-semibold text-sm hover:bg-teal-100 transition-colors">📥 Import</button>
            <button onClick={exportAll} className="flex-1 py-3 rounded-xl bg-teal-50 text-teal-700 font-semibold text-sm hover:bg-teal-100 transition-colors">📤 Export</button>
          </div>
        </div>

        {/* Reset */}
        <div className="bg-white rounded-2xl p-5 border-2 border-red-100 mb-4">
          <h3 className="font-bold text-gray-800 text-[15px] mb-2">🗑️ Reset All Data</h3>
          <p className="text-gray-400 text-[12px] mb-3">Clear all workout history, weights, and progress</p>
          <button
            onClick={() => { if (confirm('Are you sure? This will erase all your data.')) resetAll(); }}
            className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors"
          >
            Reset Everything
          </button>
        </div>

        {/* About */}
        <div className="text-center text-gray-400 text-[11px] mt-6">
          <p>FitCoach v1.0 — Progressive Web App</p>
          <p>Data stored locally on your device</p>
        </div>
      </div>

      {/* Import Modal */}
      {importModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" onClick={() => setImportModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 pb-8" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-800 mb-2">📥 Import Data</h3>
            <p className="text-gray-500 text-[13px] mb-4">Paste JSON data exported from FitCoach:</p>
            <textarea
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-teal-400 focus:outline-none resize-none font-mono text-[12px]"
              rows={6}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder='{"currentWeek": 1, "workoutHistory": [...]}'
            />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setImportModal(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm">Cancel</button>
              <button onClick={() => {
                if (importData(importText)) {
                  setImportModal(false);
                  setImportText('');
                  alert('Data imported successfully!');
                } else {
                  alert('Invalid format. Please paste valid JSON.');
                }
              }} className="flex-1 py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm">Import</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
