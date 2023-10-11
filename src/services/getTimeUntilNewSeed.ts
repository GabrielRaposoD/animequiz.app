import { Config } from '@prisma/client';
import { differenceInDays } from 'date-fns';
import { prisma } from '@/lib';

const getTimeUntilNewSeed = async () => {
  const config = (await prisma.config.findFirst()) as Config;

  const date = new Date(config.createdAt);
  const currentDay = differenceInDays(new Date(), config.createdAt);

  date.setDate(date.getDate() + currentDay + 1);

  return date;
};

export default getTimeUntilNewSeed;
