import { useEffect, useMemo, useState } from 'react';

import { api } from '@/lib';
import { get } from 'radash';
import { usePathname } from 'next/navigation';

const pathGame: { [key: string]: string } = {
  '/character-anime-quiz': 'characterAnime',
  '/character-quiz': 'character',
  '/anime-quiz': 'anime',
};

function useGame<T>(item: T, entity: string, property: string, seed: any) {
  const [correct, setCorrect] = useState<boolean>(false);
  const [tries, setTries] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [items, setItems] = useState<T[]>([]);
  const path = usePathname();

  const parsedItems = useMemo(() => {
    return items.map((item) => ({
      label:
        entity === 'characters'
          ? get<string>(item, property) +
            ' - ' +
            get<string>(item, 'animes[0].title')
          : get<string>(item, property),
      value: get<string>(item, 'apiId'),
    }));
  }, [items, property, entity]);

  const getItems = async (query = '') => {
    const body: any = {};
    body[property] = query;
    const response = await api(`/${entity}`, {
      body: JSON.stringify(body),
    });
    const data = await response.json();

    setItems(data);
  };

  useEffect(() => {
    getItems();

    const userDataJson = localStorage.getItem('game');

    const userData = userDataJson ? JSON.parse(userDataJson) : {};

    if (userData[path]) {
      const todaysData = userData[path].find((d: any) => d.day === seed.day);
      if (todaysData) {
        setCorrect(todaysData.correct);
        setTries(todaysData.tries);
        setSelectedItems(todaysData.selectedItems);
      }
    }
  }, []);

  const onItemSelect = async (value: string) => {
    const selectedItem = items.find(
      (item) =>
        get<string>(item, 'apiId').toLocaleLowerCase() ===
        value.toLocaleLowerCase()
    ) as T;

    setSelectedItems((prev) => {
      return [selectedItem, ...prev];
    });

    const isCorrect = get(item, property) === get(selectedItem, property);

    setCorrect(isCorrect);

    const userData = JSON.parse(localStorage.getItem('game') ?? '{}');

    if (!userData[path]) {
      userData[path] = [];
    }
    const index = userData[path].findIndex((d: any) => d.day === seed.day);

    if (index !== -1) {
      userData[path][index] = {
        day: seed.day,
        correct: isCorrect,
        tries: tries + 1,
        selectedItems: [selectedItem, ...selectedItems],
      };
    } else {
      userData[path].push({
        day: seed.day,
        correct: isCorrect,
        tries: tries + 1,
        selectedItems: [selectedItem, ...selectedItems],
      });
    }

    localStorage.setItem('game', JSON.stringify(userData));

    setTries((prev) => prev + 1);

    if (isCorrect) {
      await api('game/success', {
        method: 'POST',
        body: JSON.stringify({
          seedId: seed.id,
          tries: tries + 1,
          game: pathGame[path],
        }),
      });
    }
  };

  const onItemValueChange = (value: string, type: 'select' | 'input') => {
    if (type === 'select') {
      console.log(value);
      onItemSelect(value);
    } else {
      getItems(value);
    }
  };

  return { onItemValueChange, parsedItems, correct, tries, selectedItems };
}

export default useGame;
