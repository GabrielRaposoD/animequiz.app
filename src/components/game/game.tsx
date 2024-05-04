'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardTitle } from '../ui/card';

import { Combobox } from '../ui/combobox';
import ImageCanvas from './imageCanvas';
import Success from './success';
import TipCard from './tipCard';
import cs from 'clsx';
import { get } from 'radash';
import tipParser from '@/lib/tipParser';
import useGame from '@/hooks/useGame';

type GameProps<GameType> = {
  data: GameType;
  imageSrc: string;
  property: string;
  entity: string;
  tips: any[];
  placeholder: string;
  date: Date;
  seed: any;
  viewport?: 'mobile' | 'desktop';
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
  date,
  seed,
  viewport,
}: GameProps<GameType>) => {
  const { correct, onItemValueChange, parsedItems, selectedItems, tries } =
    useGame<GameType>(data, entity, property, seed);

  return (
    <div className='flex flex-col items-center gap-y-12 mt-16'>
      <Card
        className={cs(
          'items-center justify-center flex flex-col pt-6 gap-y-8 rounded-md bg-gradient-to-tl from-card to-card shadow-2xl transition-all duration-500 md:w-[400px] w-full',
          {
            'via-zinc-600/20 shadow-zinc-600/40': !correct,
            'via-green-500/60 shadow-green-500/30': correct,
          }
        )}
      >
        <AnimatePresence>
          {correct && (
            <motion.div
              key='title'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CardTitle className='font-danielbd text-3xl leading-none'>
                <motion.span
                  variants={itemAnimation}
                  animate='visible'
                  initial='hidden'
                >
                  Congrats!
                </motion.span>
              </CardTitle>
            </motion.div>
          )}
        </AnimatePresence>
        <CardContent className='flex flex-col items-center justify-center gap-y-6 w-full'>
          <ImageCanvas
            src={imageSrc}
            correct={correct}
            tries={tries}
            viewport={viewport ?? 'desktop'}
          />
          <AnimatePresence>
            {!correct ? (
              <motion.div
                key='combobox'
                className='w-full'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Combobox
                  items={parsedItems}
                  onChange={onItemValueChange}
                  placeholder={placeholder}
                  disabled={correct}
                  disabledItems={selectedItems.map((item) =>
                    get<string>(item, 'apiId')
                  )}
                />
              </motion.div>
            ) : (
              <Success
                data={data}
                property={property}
                date={date}
                tries={tries}
              />
            )}
          </AnimatePresence>
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
                        label={tip.label}
                        variant={tipParser(content, itemData)}
                        numberIs={
                          typeof content !== 'number' ||
                          typeof itemData !== 'number' ||
                          content === -1 ||
                          itemData === -1
                            ? 'equal'
                            : content > itemData
                            ? 'less'
                            : content < itemData
                            ? 'greater'
                            : 'equal'
                        }
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
