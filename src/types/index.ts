/**
 * @name Time
 * @description Time as minutes and seconds.
 */
type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

/**
 * @name Countdown
 * @description State of the countdown timer.
 */
type Countdown = {
  remainingTime: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
  isActive: boolean;
  isInactive: boolean;
  isRunning: boolean;
  isPaused: boolean;
  start: VoidFunction;
  pause: VoidFunction;
  resume: VoidFunction;
  reset: (time?: Time) => void;
};

export type { Countdown, Time };
