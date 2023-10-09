'use client';

import { useEffect, useMemo, useState } from 'react';

import { CharacterWithAnime } from '@/types';
import { Combobox } from '../ui/combobox';
import ImageCanvas from './imageCanvas';
import TipCard from './tipCard';
import tipParser from '@/lib/tipParser';

type GameProps = {
  character: CharacterWithAnime;
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

    setSelectedCharacters((prev) => [selectedCharacter, ...prev]);

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
      />
      <ol className='flex flex-col gap-y-4'>
        {selectedCharacters.map((c) => {
          return (
            <li
              key={c.id}
              className='flex flex-row text-xs gap-x-2.5 capitalize'
            >
              <TipCard
                content={c.name}
                text='Character'
                variant={tipParser(c.name, character.name)}
              />
              <TipCard
                content={c.Anime.title}
                text='Anime'
                variant={tipParser(c.Anime.title, character.Anime.title)}
              />
              <TipCard
                content={c.Anime.year}
                text='Year'
                variant={tipParser(c.Anime.year, character.Anime.year)}
              />
              <TipCard
                content={c.Anime.season ?? ''}
                text='Season'
                variant={tipParser(
                  c.Anime.season ?? '',
                  character.Anime.season ?? ''
                )}
              />
              <TipCard
                content={c.Anime.type}
                text='Type'
                variant={tipParser(c.Anime.type, character.Anime.type)}
              />
              <TipCard
                content={c.Anime.rating}
                text='Rating'
                variant={tipParser(c.Anime.rating, character.Anime.rating)}
              />
              <TipCard
                content={c.Anime.studio}
                text='Studio'
                variant={tipParser(c.Anime.studio, character.Anime.studio)}
              />
              <TipCard
                content={c.Anime.source}
                text='Source'
                variant={tipParser(c.Anime.source, character.Anime.source)}
              />
              <TipCard
                content={c.Anime.genres.join(', ')}
                text='Genres'
                variant={tipParser(c.Anime.genres, character.Anime.genres)}
              />
              <TipCard
                content={c.Anime.themes.join(', ')}
                text='Themes'
                variant={tipParser(c.Anime.themes, character.Anime.themes)}
              />
              <TipCard
                content={c.Anime.episodes}
                text='Episodes'
                variant={tipParser(c.Anime.episodes, character.Anime.episodes)}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default GuessCharacterName;
