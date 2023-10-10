'use client';

import { Card, CardContent } from '../ui/card';

import { Combobox } from '../ui/combobox';
import ImageCanvas from './imageCanvas';
import TipCard from './tipCard';
import { get } from 'radash';
import { motion } from 'framer-motion';
import tipParser from '@/lib/tipParser';
import useGame from '@/hooks/useGame';

type GameProps<GameType> = {
  data: GameType;
  imageSrc: string;
  property: string;
  entity: string;
  tips: any[];
  placeholder: string;
};

const containerAnimation = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemAnimation = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const Guess = <GameType extends unknown>({
  data,
  entity,
  imageSrc,
  property,
  tips,
  placeholder,
}: GameProps<GameType>) => {
  const { correct, onItemValueChange, parsedItems, selectedItems, tries } =
    useGame<GameType>(data, entity, property);

  return (
    <div className='flex flex-col items-center gap-y-12 mt-16'>
      <Card>
        <CardContent className='items-center justify-center flex flex-col pt-6 gap-y-6 rounded-md bg-gradient-to-tl from-black via-zinc-600/20 to-black'>
          <ImageCanvas src={imageSrc} correct={correct} tries={tries} />
          <Combobox
            items={parsedItems}
            onChange={onItemValueChange}
            placeholder={placeholder}
            disabled={correct}
            disabledItems={selectedItems.map((item) =>
              get<string>(item, property)
            )}
          />
        </CardContent>
      </Card>
      <motion.ol className='flex flex-col gap-y-4 pb-4 px-1 overflow-x-auto xl:overflow-hidden md:max-w-screen-sm lg:max-w-screen-md xl:max-w-max max-w-[300px]'>
        {selectedItems.map((item) => {
          const itemKey = get<number>(item, 'id');
          return (
            <li key={itemKey}>
              <motion.ul
                className='flex flex-row text-xs gap-x-2.5 capitalize'
                variants={containerAnimation}
                initial='hidden'
                animate='visible'
              >
                {tips.map((tip) => {
                  let content: string | number | string[] = get(item, tip.key);
                  const itemData: string | number | string[] = get(
                    data,
                    tip.key
                  );

                  console.log({ content, data, tip });

                  return (
                    <motion.li
                      variants={itemAnimation}
                      key={itemKey + tip.label}
                      animate
                    >
                      <TipCard
                        content={
                          Array.isArray(content) ? content.join(', ') : content
                        }
                        text={tip.label}
                        variant={tipParser(content, itemData)}
                      />
                    </motion.li>
                  );
                })}
              </motion.ul>
            </li>
          );
        })}
      </motion.ol>
    </div>
  );
};

export default Guess;
