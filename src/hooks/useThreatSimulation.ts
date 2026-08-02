import { useEffect, useRef } from 'react';

/**
 * Runs `callback` every `intervalMs` while `active` is true.
 * Used to drive the simulated AI detection loops (camera every 5s, etc).
 * Swap the callback for a real inference call and this hook keeps working
 * unchanged.
 */
export function useThreatSimulation(active: boolean, intervalMs: number, callback: () => void) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => savedCallback.current(), intervalMs);
    return () => clearInterval(id);
  }, [active, intervalMs]);
}
