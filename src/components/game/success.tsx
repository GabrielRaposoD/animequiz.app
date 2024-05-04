import { get } from 'radash';
import { intervalToDuration } from 'date-fns';
import { motion } from 'framer-motion';
import useCountdown from '@/hooks/useCountdown';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type SuccessProps = {
  data: any;
  date: Date;
  property: string;
  tries: number;
};

const Success = ({ data, date, property, tries }: SuccessProps) => {
  const duration = intervalToDuration({
    start: new Date(),
    end: date,
  });

  const router = useRouter();

  const { hours, minutes, seconds, remainingTime } = useCountdown({
    hours: duration.hours || 0 + (duration.days || 0) * 24,
    minutes: duration.minutes,
    seconds: duration.seconds,
    autoStart: true,
    format: 'hh:mm:ss',
  });

  useEffect(() => {
    if (remainingTime === 0) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingTime]);

  return (
    <motion.div
      key='success'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      exit={{ opacity: 0 }}
      className='mt-2 flex flex-col items-center justify-center gap-y-2 w-full font-medium text-center text-lg'
    >
      <p>You guessed</p>
      <p className=' -mt-1.5 font-daniel'>{get<string>(data, property)}</p>
      <p>Number of tries</p>
      <p className='-mt-1.5 font-daniel'>{tries}</p>
      <p>Next game in</p>
      <div className='flex flex-row -mt-1.5 gap-x-0.5'>
        {[
          hours.toString().padStart(2, '0'),
          ':',
          minutes.toString().padStart(2, '0'),
          ':',
          seconds.toString().padStart(2, '0'),
        ]
          .join('')
          .split('')
          .map((char, index) => {
            return (
              <motion.p
                key={char + index}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0, position: 'absolute' }}
                transition={{
                  ease: 'easeOut',
                  duration: 1,
                }}
                className='font-daniel relative'
              >
                {char}
              </motion.p>
            );
          })}
      </div>
    </motion.div>
  );
};

export default Success;
