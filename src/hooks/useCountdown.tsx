import { Countdown, Time } from '@/types';
import {
  calculateInitialTime,
  calculateRemainingHours,
  calculateRemainingMinutes,
  calculateRemainingSeconds,
} from '@/lib/time';
import { format as formatTime, toDate } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';

type useCountdownParams = {
  hours?: number;
  minutes?: number;
  seconds?: number;
  format?: string;
  autoStart?: boolean;
};

/**
 * @name useCountdown
 * @description React hook countdown timer.
 */
const useCountdown = ({
  hours = 0,
  minutes = 0,
  seconds = 0,
  format = 'hh:mm:ss',
  autoStart = false,
}: useCountdownParams = {}): Countdown => {
  const id = useRef(0);

  // time
  const [remainingTime, setRemainingTime] = useState(
    calculateInitialTime({ hours, minutes, seconds })
  );

  // status
  const [isActive, setIsActive] = useState(false);
  const [isInactive, setIsInactive] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(
    () => {
      if (autoStart) {
        id.current = window.setInterval(calculateRemainingTime, 1000);

        setIsActive(true);
        setIsInactive(false);
        setIsRunning(true);
        setIsPaused(false);
      }

      return () => window.clearInterval(id.current);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const calculateRemainingTime = useCallback(() => {
    setRemainingTime((time) => {
      if (time - 1000 <= 0) {
        window.clearInterval(id.current);

        setIsActive(false);
        setIsInactive(true);
        setIsRunning(false);
        setIsPaused(false);

        return 0;
      }

      return time - 1000;
    });
  }, []);

  const pause = (): void => {
    if (isPaused || isInactive) {
      return;
    }

    window.clearInterval(id.current);

    setIsActive(true);
    setIsInactive(false);
    setIsRunning(false);
    setIsPaused(true);
  };

  const start = (): void => {
    if (isRunning) {
      return;
    }

    id.current = window.setInterval(calculateRemainingTime, 1000);

    setIsActive(true);
    setIsInactive(false);
    setIsRunning(true);
    setIsPaused(false);
  };

  const reset = (time: Time = { hours, minutes, seconds }) => {
    window.clearInterval(id.current);

    if (autoStart) {
      id.current = window.setInterval(calculateRemainingTime, 1000);

      setIsActive(true);
      setIsInactive(false);
      setIsRunning(true);
      setIsPaused(false);
    } else {
      setIsActive(false);
      setIsInactive(true);
      setIsRunning(false);
      setIsPaused(false);
    }

    setRemainingTime(calculateInitialTime(time));
  };

  const countdown: Countdown = {
    hours: calculateRemainingHours(remainingTime),
    minutes: calculateRemainingMinutes(remainingTime),
    seconds: calculateRemainingSeconds(remainingTime),
    formatted: formatTime(toDate(remainingTime), format),
    isActive,
    isInactive,
    isRunning,
    isPaused,
    start,
    pause,
    resume: start,
    reset,
  };

  return countdown;
};

export default useCountdown;
