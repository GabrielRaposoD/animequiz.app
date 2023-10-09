import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

type TipCardProps = {
  text: string;
  content: string | number;
  variant: 'correct' | 'incorrect' | 'partial';
};

const buttonVariants = cva(
  'rounded-lg text-card-foreground p-2 w-24 h-24 flex items-center justify-center text-center',
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

const TipCard = ({ content, variant, text }: TipCardProps) => {
  return (
    <div className='flex flex-col gap-y-2 items-center'>
      <span>{text}</span>
      <div className={cn(buttonVariants({ variant }))}>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default TipCard;
