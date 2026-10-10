import { useState, useEffect } from 'react';

/**
 * useCountdown hook placeholder (Completed in Phase 2)
 */
export function useCountdown(targetDateISO) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isArrived: false,
  });

  return timeLeft;
}
