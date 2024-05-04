import { Dispatch, SetStateAction, useEffect } from 'react';

import useCountdown from '@/hooks/useCountdown';

const UNLIMITED_TIME = 30;

type CountdownProps = {
  paused: boolean;
  setTimedOut: Dispatch<SetStateAction<boolean>>;
  setTotalTime: Dispatch<SetStateAction<number>>;
};

const Countdown = ({ paused, setTimedOut, setTotalTime }: CountdownProps) => {
  const { seconds, pause, reset, start } = useCountdown({
    seconds: UNLIMITED_TIME,
    autoStart: false,
    format: 'hh:mm:ss',
    onCompleted: () => {
      setTimedOut(true);
    },
  });

  useEffect(() => {
    if (paused) {
      pause();
      setTotalTime((prev) => prev + UNLIMITED_TIME - seconds);
      reset();
    } else {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  return <p>{seconds.toString().padStart(2, '0')}</p>;
};

export default Countdown;
