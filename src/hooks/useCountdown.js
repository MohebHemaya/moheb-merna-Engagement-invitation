import { useState, useEffect, useCallback } from 'react';

/**
 * useCountdown hook
 * Calculates remaining time until targetDateISO.
 * Ticks every second, pauses when document is hidden, and immediately syncs on visibilitychange.
 */
export function useCountdown(targetDateISO) {
  const calculateTimeLeft = useCallback(() => {
    if (!targetDateISO) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isArrived: true };
    }

    const targetTime = new Date(targetDateISO).getTime();
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isArrived: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isArrived: false };
  }, [targetDateISO]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    // Initial sync
    setTimeLeft(calculateTimeLeft());

    let intervalId = null;

    const startTimer = () => {
      if (!intervalId) {
        intervalId = setInterval(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
      }
    };

    const stopTimer = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setTimeLeft(calculateTimeLeft());
        startTimer();
      } else {
        stopTimer();
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [calculateTimeLeft]);

  return timeLeft;
}
