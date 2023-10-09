import { Config } from '@prisma/client';
import { NextResponse } from 'next/server';
import Prando from 'prando';
import { differenceInDays } from 'date-fns';
import { prisma } from '@/lib';

export async function GET() {
  const config = (await prisma.config.findFirst({})) as Config;

  const currentDay = differenceInDays(new Date(config.createdAt), new Date());

  const currentSeed = await prisma.seed.findFirst({
    where: {
      day: currentDay,
    },
  });

  const animeCount = await prisma.anime.count();

  const rng = new Prando(currentSeed!.seed);

  const anime = await prisma.anime.findUnique({
    where: {
      id: rng.nextInt(1, animeCount),
    },
  });

  return NextResponse.json(anime);
}
