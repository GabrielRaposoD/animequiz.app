import { Config } from '@prisma/client';
import { differenceInDays } from 'date-fns';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib';

const getSeed = async () => {
  const config = (await prisma.config.findFirst({})) as Config;

  const currentDay = differenceInDays(new Date(), config.createdAt);

  const seeds = await prisma.seed.findMany({});

  const todaysSeed = seeds.find((seed) => seed.day === currentDay);

  if (todaysSeed) {
    return todaysSeed;
  }

  const characterCount = await prisma.character.count();
  const animeCount = await prisma.anime.count();
  const seed = nanoid(64);

  return await prisma.seed.create({
    data: {
      seed,
      day: currentDay,
      animeCount: animeCount,
      characterCount: characterCount,
      config: {
        connect: {
          id: config.id,
        },
      },
    },
  });
};

export default getSeed;
