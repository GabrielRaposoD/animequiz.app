'use client';

import { useEffect, useMemo, useState } from 'react';

import { CharacterWithAnime } from '@/types';
import { Combobox } from '../ui/combobox';
import ImageCanvas from './imageCanvas';
import TipCard from './tipCard';
import { characterQuizTips } from '@/constants/characterQuiz';
import { get } from 'radash';
import { motion } from 'framer-motion';
import tipParser from '@/lib/tipParser';

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

const GuessCharacterName = ({ character }: GameProps) => {
  const [correct, setCorrect] = useState<boolean>(false);
  const [tries, setTries] = useState<number>(0);
  const [selectedCharacters, setSelectedCharacters] = useState<
    CharacterWithAnime[]
  >([]);
  const [characters, setCharacters] = useState<CharacterWithAnime[]>([]);

  const charactersItems = useMemo(
    () =>
      characters.map((character) => ({
        label: character.name,
        value: character.name,
      })),
    [characters]
  );

  useEffect(() => {
    getCharacters();
  }, []);

  const getCharacters = async (query = '') => {
    const response = await fetch(`/api/characters?name=${query}`);
    const data = await response.json();

    setCharacters(data);
  };

  const onCharacterSelect = (value: string) => {
    const selectedCharacter = characters.find(
      (character) =>
        character.name.toLocaleLowerCase() === value.toLocaleLowerCase()
    ) as CharacterWithAnime;

    setSelectedCharacters((prev) => {
      console.log(prev);
      return [selectedCharacter, ...prev];
    });

    const isCorrect = character.name === selectedCharacter.name;

    setCorrect(isCorrect);

    if (!isCorrect) {
      setTries((prev) => prev + 1);
    }
  };

  const onCharacterValueChange = (value: string, type: 'select' | 'input') => {
    if (type === 'select') {
      onCharacterSelect(value);
    } else {
      getCharacters(value);
    }
  };

  return (
    <div className='flex flex-col items-center gap-y-4'>
      <ImageCanvas src={character!.image} correct={correct} tries={tries} />
      <Combobox
        items={charactersItems}
        onChange={onCharacterValueChange}
        placeholder='Who is this character?'
        disabled={correct}
        disabledItems={selectedCharacters.map((c) => c.name)}
      />
      <motion.ol className='flex flex-col gap-y-4'>
        {selectedCharacters.map((c) => {
          return (
            <li key={c.id}>
              <motion.ul
                className='flex flex-row text-xs gap-x-2.5 capitalize'
                variants={container}
                initial='hidden'
                animate='visible'
              >
                {characterQuizTips.map((tip) => {
                  let content: string | number | string[] = get(c, tip.key);
                  const characterData: string | number | string[] = get(
                    character,
                    tip.key
                  );

                  return (
                    <motion.li variants={item} key={c.id + tip.label} animate>
                      <TipCard
                        content={
                          Array.isArray(content) ? content.join(', ') : content
                        }
                        text={tip.label}
                        variant={tipParser(content, characterData)}
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

export default GuessCharacterName;
