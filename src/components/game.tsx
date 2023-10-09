'use client';

import { useEffect, useMemo, useState } from 'react';

import { Character } from '@prisma/client';
import { CharacterWithAnime } from '@/types';
import { Combobox } from './ui/combobox';
import ImageCanvas from './imageCanvas';

type GameProps = {
  character: CharacterWithAnime;
};

const Game = ({ character }: GameProps) => {
  const [correct, setCorrect] = useState<boolean>(false);
  const [tries, setTries] = useState<number>(0);
  const [characterName, setCharacterName] = useState<string>('');
  const [characters, setCharacters] = useState<Character[]>([]);

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

  const onAnimeChange = (value: string, type: 'select' | 'input') => {
    if (type === 'select') {
      setCharacterName(value);
    } else {
      getCharacters(value);
    }
  };

  if (!character) return null;
  return (
    <div className='flex flex-col items-center gap-y-4'>
      <ImageCanvas src={character.image} correct={correct} tries={tries} />
      <Combobox
        items={charactersItems}
        value={characterName}
        onChange={onAnimeChange}
      />
    </div>
  );
};

export default Game;
