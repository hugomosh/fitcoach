import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(ref.current);
    }
    return () => clearInterval(ref.current);
  }, [running]);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => { setRunning(false); setSeconds(0); }, []);
  const toggle = useCallback(() => setRunning(r => !r), []);

  const format = (s) => {
    const m = Math.floor((s || seconds) / 60).toString().padStart(2, '0');
    const sec = ((s || seconds) % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return { seconds, running, start, pause, reset, toggle, format };
}
