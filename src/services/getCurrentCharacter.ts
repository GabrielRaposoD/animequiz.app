import { Config } from '@prisma/client';
import Prando from 'prando';
import { differenceInDays } from 'date-fns';
import { prisma } from '@/lib';

const getCurrentCharacter = async () => {
  const config = (await prisma.config.findFirst({})) as Config;

  const currentDay = differenceInDays(new Date(config.createdAt), new Date());

  const currentSeed = await prisma.seed.findFirst({
    where: {
      day: currentDay,
    },
  });

  const characterCount = await prisma.character.count();

  const rng = new Prando(currentSeed!.seed);

  const character = await prisma.character.findUnique({
    where: {
      id: rng.nextInt(1, characterCount),
      NOT: {
        image: {
          contains: 'questionmark_23.gif',
        },
      },
    },
    include: {
      Anime: true,
    },
  });

  return character;
};

export default getCurrentCharacter;
