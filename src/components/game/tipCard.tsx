import { ArrowBigDown, ArrowBigUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

type TipCardProps = {
  label: string;
  content: string | number;
  variant: 'correct' | 'incorrect' | 'partial';
  numberIs?: 'greater' | 'less' | 'equal';
};

const buttonVariants = cva(
  'rounded-lg text-card-foreground p-2 w-24 h-24 flex items-center justify-center text-center relative overflow-y-auto overflow-x-hidden no-scrollbar',
  {
    variants: {
      variant: {
        correct:
          'bg-green-600 shadow-lg shadow-green-500/50 border-2 border-green-500',
        incorrect:
          'bg-rose-600 shadow-lg shadow-rose-500/50 border-2 border-rose-500',
        partial:
          'bg-amber-600 shadow-lg shadow-amber-500/50 border-2 border-amber-500',
      },
    },
  }
);

const TipCard = ({
  content,
  variant,
  label,
  numberIs = 'equal',
}: TipCardProps) => {
  return (
    <div className='flex flex-col gap-y-2 items-center'>
      <span>{label}</span>
      <div className={cn(buttonVariants({ variant }))}>
        <p className='capitalize flex flex-row flex-wrap items-center justify-center z-10'>
          {typeof content === 'string'
            ? content.toLowerCase()
            : content === -1
            ? 'Unknown'
            : content}
        </p>
        {numberIs === 'greater' && (
          <ArrowBigUp
            className='absolute pointer-events-none text-rose-900/90'
            strokeWidth={1}
            fill='rgb(136 19 55 / 0.9)'
            size={90}
          />
        )}
        {numberIs === 'less' && (
          <ArrowBigDown
            className='absolute pointer-events-none text-rose-900/90'
            strokeWidth={1}
            fill='rgb(136 19 55 / 0.9)'
            size={90}
          />
        )}
      </div>
    </div>
  );
};

export default TipCard;
