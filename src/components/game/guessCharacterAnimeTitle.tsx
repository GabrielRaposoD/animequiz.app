'use client';

import { useEffect, useMemo, useState } from 'react';

import { Anime } from '@prisma/client';
import { CharacterWithAnime } from '@/types';
import { Combobox } from '../ui/combobox';
import ImageCanvas from './imageCanvas';
import TipCard from './tipCard';
import { characterAnimeQuizTips } from '@/constants/tips';
import { get } from 'radash';
import { motion } from 'framer-motion';
import tipParser from '@/lib/tipParser';
import useGame from '@/hooks/useGame';

type GameProps = {
  character: CharacterWithAnime;
};

const container = {
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

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const GuessCharacterAnimeTitle = ({ character }: GameProps) => {
  const { correct, onItemValueChange, parsedItems, selectedItems, tries } =
    useGame<Anime>(character.anime, 'animes', 'title');

  return (
    <div className='flex flex-col items-center gap-y-4 mt-20'>
      <ImageCanvas src={character!.image} correct={correct} tries={tries} />
      <Combobox
        items={parsedItems}
        onChange={onItemValueChange}
        placeholder='Which anime is this character from?'
        disabled={correct}
        disabledItems={selectedItems.map((c) => c.title)}
      />
      <motion.ol className='flex flex-col gap-y-4'>
        {selectedItems.map((c) => {
          return (
            <li key={c.id}>
              <motion.ul
                className='flex flex-row text-xs gap-x-2.5 capitalize'
                variants={container}
                initial='hidden'
                animate='visible'
              >
                {characterAnimeQuizTips.map((tip) => {
                  let content: string | number | string[] = get(c, tip.key);
                  const animeData: string | number | string[] = get(
                    character.anime,
                    tip.key
                  );

                  return (
                    <motion.li variants={item} key={c.id + tip.label} animate>
                      <TipCard
                        content={
                          Array.isArray(content) ? content.join(', ') : content
                        }
                        text={tip.label}
                        variant={tipParser(content, animeData)}
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

export default GuessCharacterAnimeTitle;
