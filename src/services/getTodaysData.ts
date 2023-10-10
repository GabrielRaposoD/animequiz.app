import Prando from 'prando';
import getSeed from './getSeed';
import { prisma } from '@/lib';

const getTodaysData = async (
  entity: 'anime' | 'character',
  rngIteration = 1
) => {
  const currentSeed = await getSeed();

  const rng = new Prando(currentSeed!.seed);

  let rngNum = 0;

  if (entity === 'character') {
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

    return character[0];
  } else {
    for (let i = 0; i < rngIteration; i++) {
      rngNum = rng.nextInt(1, currentSeed.animeCount) - 1;
    }

    const anime = await prisma[entity].findMany({
      skip: rngNum,
      take: 1,
      orderBy: {
        id: 'asc',
      },
    });

    return anime[0];
  }
};

export default getTodaysData;
