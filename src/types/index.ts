import { Prisma } from '@prisma/client';

const characterWithAnime = Prisma.validator<Prisma.CharacterDefaultArgs>()({
  include: { anime: true },
});

type CharacterWithAnime = Prisma.CharacterGetPayload<typeof characterWithAnime>;

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

export type { CharacterWithAnime, Countdown, Time };
