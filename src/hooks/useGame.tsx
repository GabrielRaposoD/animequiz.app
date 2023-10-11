import { useEffect, useMemo, useState } from 'react';

import { Seed } from '@prisma/client';
import { get } from 'radash';
import { usePathname } from 'next/navigation';

function useGame<T>(item: T, entity: string, property: string, seed: Seed) {
  const [correct, setCorrect] = useState<boolean>(false);
  const [tries, setTries] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [items, setItems] = useState<T[]>([]);
  const path = usePathname();

  const parsedItems = useMemo(
    () =>
      items.map((item) => ({
        label: get<string>(item, property),
        value: get<string>(item, property),
      })),
    [items, property]
  );

  const getItems = async (query = '') => {
    const response = await fetch(`/api/${entity}?${property}=${query}`);
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

  const onItemSelect = (value: string) => {
    const selectedItem = items.find(
      (item) =>
        get<string>(item, property).toLocaleLowerCase() ===
        value.toLocaleLowerCase()
    ) as T;

    setSelectedItems((prev) => {
      return [selectedItem, ...prev];
    });

    const isCorrect = get(item, property) === get(selectedItem, property);

    setCorrect(isCorrect);

    if (!isCorrect) {
      setTries((prev) => prev + 1);
    } else {
      const userDataJson = localStorage.getItem('game');

      const userData = userDataJson ? JSON.parse(userDataJson) : {};

      if (!userData[path]) {
        userData[path] = [];
      }

      userData[path].push({
        correct: true,
        selectedItems: [selectedItem, ...selectedItems],
        tries,
        day: seed.day,
      });

      localStorage.setItem('game', JSON.stringify(userData));
    }
  };

  const onItemValueChange = (value: string, type: 'select' | 'input') => {
    if (type === 'select') {
      onItemSelect(value);
    } else {
      getItems(value);
    }
  };

  return { onItemValueChange, parsedItems, correct, tries, selectedItems };
}

export default useGame;
