'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, HeartCrack } from 'lucide-react';
import { formatDuration, intervalToDuration } from 'date-fns';

import { Button } from '@/components/ui/button';
import ImageCanvas from '@/components/game/imageCanvas';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import cs from 'clsx';
import useUnlimited from '@/hooks/useUnlimited';

type UnlimitedProps = {
  type: 'anime' | 'character';
  viewport: 'mobile' | 'desktop';
};

const StatsListItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <li className='flex flex-row items-center whitespace-nowrap gap-x-4'>
    <p>{label}</p>
    <Separator className='shrink bg-transparent border-t-2 mt-1 border-zinc-500 border-dotted' />
    <p>{value}</p>
  </li>
);

const Unlimited = ({ type, viewport }: UnlimitedProps) => {
  const {
    score,
    seconds,
    selected,
    correct,
    current,
    disabled,
    lives,
    loading,
    lost,
    onSelect,
    init,
    totalTime,
  } = useUnlimited(type);

  if (lost) {
    return (
      <div className='flex flex-col w-full'>
        <h2 className='text-2xl font-medium text-center'>Your stats</h2>
        <ul className='flex flex-col gap-y-3 mt-8'>
          <StatsListItem label='Score' value={score} />
          <StatsListItem
            label='Total Time'
            value={formatDuration(
              intervalToDuration({ start: 0, end: totalTime * 1000 }),
              {
                format: ['hours', 'minutes', 'seconds'],
                delimiter: ':',
                zero: true,
                locale: {
                  formatDistance: (_token, count: number) => {
                    return count.toString().padStart(2, '0');
                  },
                },
              }
            )}
          />
          <StatsListItem
            label='Level Reached'
            value={Math.floor(score / 5) + 1}
          />
        </ul>

        <ol className='mt-10 self-center flex flex-col gap-y-2'>
          {lives.map((live, i) => (
            <li
              key={live.lostOn?.apiId ?? i}
              className='flex flex-row items-center gap-x-6'
            >
              <Avatar className='w-16 h-16'>
                <AvatarImage src={live.lostOn?.image} alt={live.lostOn?.name} />
                <AvatarFallback>AN</AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <p className='text-lg font-base'>{live.lostOn?.name}</p>
                <p className='text-sm text-zinc-400'>Life Lost</p>
              </div>
            </li>
          ))}
        </ol>
        <Button
          className='w-max self-center mt-12 uppercase'
          variant='secondary'
          onClick={() => {
            init();
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className='w-full flex flex-row justify-between mb-4'>
        <p className='font-daniel text-2xl'>
          {score.toString().padStart(5, '0')}
        </p>
        <div className='font-daniel text-2xl flex flex-row gap-x-2'>
          <div className='flex flex-row gap-x-0.5'>
            {lives.map((live, i) => {
              if (live.lost) {
                return <HeartCrack className='text-pink-700' key={i} />;
              }

              return <Heart className='text-pink-700 fill-current' key={i} />;
            })}
          </div>
          <p>{loading ? '00' : seconds.toString().padStart(2, '0')}</p>
        </div>
      </div>
      <ImageCanvas
        src={correct?.image}
        viewport={viewport}
        canvasWidth={322}
        canvasHeight={455}
      />
      <div className='grid grid-cols-2 grid-flow-row gap-x-4 gap-y-3 w-full mt-16'>
        {loading ? (
          <>
            <Skeleton className='py-5 w-full' />
            <Skeleton className='py-5 w-full' />
            <Skeleton className='py-5 w-full' />
            <Skeleton className='py-5 w-full' />
          </>
        ) : (
          current.map((item) => (
            <Button
              key={item.apiId + window.crypto.randomUUID()}
              className={cs('flex flex-col py-5 transition-all duration-500', {
                'bg-green-600 disabled:opacity-100 border-green-500 shadow-md shadow-green-500/50':
                  disabled && item.apiId === correct.apiId,
                'bg-rose-600 disabled:opacity-100 border-rose-500 shadow-md shadow-rose-500/50':
                  disabled &&
                  selected?.apiId === item.apiId &&
                  item.apiId !== correct.apiId,
              })}
              variant='outline'
              onClick={() => {
                onSelect(item);
              }}
              disabled={disabled || lost}
            >
              {item.name}
              <span className='text-zinc-200 text-xs'>{item.sub}</span>
            </Button>
          ))
        )}
      </div>
    </>
  );
};

export default Unlimited;
