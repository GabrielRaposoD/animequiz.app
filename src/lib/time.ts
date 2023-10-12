import { Time } from '@/types';

const calculateInitialTime = ({ hours, minutes, seconds }: Time): number => {
  const initialHours = hours * 60 * 60 * 1000;
  const initialMinutes = minutes * 60 * 1000;
  const initialSeconds = seconds * 1000;
  const initialTime = initialMinutes + initialSeconds + initialHours;

  return initialTime;
};

const calculateRemainingHours = (remainingTime: number): number =>
  Math.floor((remainingTime / (1000 * 60 * 60)) % (1000 * 60 * 60));

const calculateRemainingMinutes = (remainingTime: number): number =>
  Math.floor((remainingTime / (60 * 1000)) % 60);

const calculateRemainingSeconds = (remainingTime: number): number =>
  Math.floor((remainingTime / 1000) % 60);

export {
  calculateInitialTime,
  calculateRemainingMinutes,
  calculateRemainingSeconds,
  calculateRemainingHours,
};
