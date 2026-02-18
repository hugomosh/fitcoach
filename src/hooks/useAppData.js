import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fitcoach_v2';

const DEFAULT_DATA = {
  currentWeek: 1,
  workoutHistory: [],
  recoveryHistory: [],
  weights: {},
  pains: [],
  streakDays: [],
  settings: {
    restTimerSeconds: 60,
  },
};

export function useAppData() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_DATA, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load data from localStorage', e);
    }
    return DEFAULT_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save data to localStorage', e);
    }
  }, [data]);

  const update = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  }, []);

  const logWorkout = useCallback((record) => {
    const today = new Date().toDateString();
    setData(prev => ({
      ...prev,
      workoutHistory: [...prev.workoutHistory, { ...record, date: new Date().toISOString() }],
      streakDays: [...new Set([...(prev.streakDays || []), today])],
    }));
  }, []);

  const logRecovery = useCallback((record) => {
    const today = new Date().toDateString();
    setData(prev => ({
      ...prev,
      recoveryHistory: [...prev.recoveryHistory, { ...record, date: new Date().toISOString() }],
      streakDays: [...new Set([...(prev.streakDays || []), today])],
    }));
  }, []);

  const setWeight = useCallback((exerciseId, value) => {
    setData(prev => ({
      ...prev,
      weights: { ...prev.weights, [exerciseId]: value },
    }));
  }, []);

  const addPain = useCallback((pain) => {
    setData(prev => ({
      ...prev,
      pains: [...prev.pains, { ...pain, date: new Date().toISOString() }],
    }));
  }, []);

  const setWeek = useCallback((week) => {
    setData(prev => ({ ...prev, currentWeek: Math.max(1, Math.min(2, week)) }));
  }, []);

  const getStreak = useCallback(() => {
    const days = (data.streakDays || []).sort().reverse();
    if (days.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i <= days.length; i++) {
      const check = new Date(today);
      check.setDate(check.getDate() - i);
      if (days.includes(check.toDateString())) streak++;
      else if (i > 0) break;
    }
    return streak;
  }, [data.streakDays]);

  const exportAll = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitcoach-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((jsonString) => {
    try {
      const imported = JSON.parse(jsonString);
      setData({ ...DEFAULT_DATA, ...imported });
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  const resetAll = useCallback(() => {
    setData(DEFAULT_DATA);
  }, []);

  return {
    data, update, logWorkout, logRecovery, setWeight, addPain,
    setWeek, getStreak, exportAll, importData, resetAll,
  };
}
