import { Config } from '@prisma/client';
import Prando from 'prando';
import { differenceInDays } from 'date-fns';
import { prisma } from '@/lib';

const getCurrentCharacterAnime = async () => {
  const config = (await prisma.config.findFirst({})) as Config;

  const currentDay = differenceInDays(new Date(config.createdAt), new Date());

  const currentSeed = await prisma.seed.findFirst({
    where: {
      day: currentDay,
    },
  });

  const rng = new Prando(currentSeed!.seed);

  const character = await prisma.character.findMany({
    where: {
      NOT: {
        image: {
          contains: 'questionmark_23.gif',
        },
      },
    },
    skip: Math.trunc(rng.next(1, currentSeed!.characterCount)) - 1,
    take: 1,
    orderBy: {
      id: 'asc',
    },
    include: {
      anime: true,
    },
  });

  return character[0];
};

export default getCurrentCharacterAnime;
