'use client';

import { useEffect, useMemo, useState } from 'react';

import { Anime } from '@prisma/client';
import { Combobox } from '../ui/combobox';
import ImageCanvas from './imageCanvas';
import TipCard from './tipCard';
import { characterAnimeQuizTips } from '@/constants/tips';
import { get } from 'radash';
import { motion } from 'framer-motion';
import tipParser from '@/lib/tipParser';

type GameProps = {
  anime: Anime;
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

const GuessAnimeTitle = ({ anime }: GameProps) => {
  const [correct, setCorrect] = useState<boolean>(false);
  const [tries, setTries] = useState<number>(0);
  const [selectedAnimes, setSelectedAnimes] = useState<Anime[]>([]);
  const [animes, setAnimes] = useState<Anime[]>([]);

  const animesItems = useMemo(
    () =>
      animes.map((anime) => ({
        label: anime.title,
        value: anime.title,
      })),
    [animes]
  );

  useEffect(() => {
    getAnimes();
  }, []);

  const getAnimes = async (query = '') => {
    const response = await fetch(`/api/animes?title=${query}`);
    const data = await response.json();

    setAnimes(data);
  };

  const onAnimeSelect = (value: string) => {
    const selectedAnime = animes.find(
      (anime) => anime.title.toLocaleLowerCase() === value.toLocaleLowerCase()
    ) as Anime;

    setSelectedAnimes((prev) => {
      return [selectedAnime, ...prev];
    });

    const isCorrect = anime.title === selectedAnime.title;

    setCorrect(isCorrect);

    if (!isCorrect) {
      setTries((prev) => prev + 1);
    }
  };

  const onAnimeValueChange = (value: string, type: 'select' | 'input') => {
    if (type === 'select') {
      onAnimeSelect(value);
    } else {
      getAnimes(value);
    }
  };

  return (
    <div className='flex flex-col items-center gap-y-4 mt-20'>
      <ImageCanvas src={anime!.banner} correct={correct} tries={tries} />
      <Combobox
        items={animesItems}
        onChange={onAnimeValueChange}
        placeholder='Which anime is this character from?'
        disabled={correct}
        disabledItems={selectedAnimes.map((c) => c.title)}
      />
      <motion.ol className='flex flex-col gap-y-4'>
        {selectedAnimes.map((c) => {
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
                    anime,
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

export default GuessAnimeTitle;
