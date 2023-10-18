import { api, shuffleArray } from '@/lib';
import { useCallback, useEffect, useState } from 'react';

import { decryptData } from '@/lib/decryptData';
import { objectToSearchString } from 'serialize-query-params';
import { sleep } from 'radash';
import useCountdown from './useCountdown';

type Option = {
  apiId: string;
  name: string;
  image: string;
  sub?: string;
};

type Live = {
  lost: boolean;
  lostOn?: Option;
};

const UNLIMITED_TIME = 30;

function useUnlimited(type: 'character' | 'anime') {
  const [score, setScore] = useState<number>(0);
  const [next, setNext] = useState(null);
  const [current, _setCurrent] = useState<Option[]>([]);
  const [correct, setCorrect] = useState<any>(null);
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [lives, setLives] = useState<Live[]>([
    { lost: false },
    { lost: false },
    { lost: false },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const [lost, setLost] = useState<boolean>(false);
  const [timedOut, setTimedOut] = useState<boolean>(false);
  const [totalTime, setTotalTime] = useState<number>(0);

  const onSelect = async (option: Option) => {
    pause();
    setSelected(option);
    setDisabled(true);
    setTotalTime((prev) => prev + UNLIMITED_TIME - seconds);

    if (option?.apiId === correct?.apiId) {
      setScore((prev) => prev + 1);
    } else {
      const livesCopy = [...lives];
      const lostIndex = livesCopy.findIndex((o) => o.lost === false);
      livesCopy[lostIndex] = {
        lost: true,
        lostOn: parseData(correct),
      };

      setLives(livesCopy);

      if (lostIndex === 2) {
        setLost(true);
        return;
      }
    }

    const nextCopy = next;
    await getNext();

    await sleep(1000);

    setCurrent(nextCopy);
  };

  const { seconds, pause, reset } = useCountdown({
    seconds: UNLIMITED_TIME,
    autoStart: true,
    format: 'hh:mm:ss',
    onCompleted: () => {
      setTimedOut(true);
    },
  });

  const getData = async () => {
    const query = objectToSearchString({
      blacklist: blacklist,
      minScore: (80 - score / 5).toFixed(0),
    });

    const res = await api(`game/unlimited/${type}?${query}`, {
      cache: 'no-cache',
    })
      .then((res) => res.json())
      .then(async (res) => await decryptData(res));

    return res;
  };

  const getNext = async () => {
    const res = await getData();

    setBlacklist((prev) => [...prev, res.correct.apiId]);

    setNext(res);
  };

  const parseData = useCallback(
    (data: any): Option => {
      let name;
      let sub: string | undefined;

      if (type === 'anime') {
        name = data.title;
      } else {
        name = data.name;
        sub = data.animes[0].title;
      }

      return {
        apiId: data.apiId,
        name: name,
        image: data.image,
        sub: sub,
      };
    },
    [type]
  );

  const setCurrent = (data: any) => {
    setCorrect(data.correct);

    const options = [data.correct, ...data.random].map((item: any) =>
      parseData(item)
    );

    _setCurrent(shuffleArray(options));
    setSelected(null);
    setDisabled(false);
    reset();
  };

  const init = async () => {
    setLoading(true);
    _setCurrent([]);
    setLives([{ lost: false }, { lost: false }, { lost: false }]);
    setNext(null);
    setLost(false);
    setSelected(null);
    setDisabled(false);
    setScore(0);

    const curr = await getData();
    setBlacklist(() => [curr.correct.apiId, '']);

    await getNext();
    setLoading(false);
    setCurrent(curr);
  };

  useEffect(() => {
    if (!current.length) {
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timedOut) {
      setTimedOut(false);
      onSelect({ apiId: 'timedOut', name: '', image: '' });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timedOut]);

  return {
    score,
    loading,
    lost,
    onSelect,
    disabled,
    current,
    correct,
    lives,
    seconds,
    selected,
    init,
    totalTime,
  };
}

export default useUnlimited;
