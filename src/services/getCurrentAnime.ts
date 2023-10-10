import { Config } from '@prisma/client';
import Prando from 'prando';
import { differenceInDays } from 'date-fns';
import { prisma } from '@/lib';

const getCurrentAnime = async () => {
  const config = (await prisma.config.findFirst({})) as Config;

  const currentDay = differenceInDays(new Date(config.createdAt), new Date());

  const currentSeed = await prisma.seed.findFirst({
    where: {
      day: currentDay,
    },
  });

  const rng = new Prando(currentSeed!.seed);

  const anime = await prisma.anime.findMany({
    skip: rng.nextInt(1, currentSeed!.animeCount) - 1,
    take: 1,
    orderBy: {
      id: 'asc',
    },
  });

  return anime[0];
};

export default getCurrentAnime;
