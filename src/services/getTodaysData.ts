import Prando from 'prando';
import { Seed } from '@prisma/client';
import getSeed from './getSeed';
import { prisma } from '@/lib';

const getTodaysData = async <T>(
  entity: 'anime' | 'character',
  rngIteration = 1
): Promise<{ data: T; seed: Seed }> => {
  const currentSeed = await getSeed();

  const rng = new Prando(currentSeed!.seed);

  let rngNum = 0;

  if (entity) {
    for (let i = 0; i < rngIteration; i++) {
      rngNum = rng.nextInt(1, currentSeed.characterCount) - 1;
    }

    const character = await prisma.character.findMany({
      where: {
        NOT: {
          image: {
            contains: 'questionmark_23.gif',
          },
        },
      },
      skip: rngNum,
      take: 1,
      orderBy: {
        id: 'asc',
      },
      include: {
        anime: true,
      },
    });

    return { data: character[0] as T, seed: currentSeed };
  } else {
    for (let i = 0; i < rngIteration; i++) {
      rngNum = rng.nextInt(1, currentSeed.animeCount) - 1;
    }

    const anime = await prisma.anime.findMany({
      skip: rngNum,
      take: 1,
      orderBy: {
        id: 'asc',
      },
    });

    return { data: anime[0] as T, seed: currentSeed };
  }
};

export default getTodaysData;
