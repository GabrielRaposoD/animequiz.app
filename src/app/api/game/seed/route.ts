import { NextResponse } from 'next/server';
import { differenceInDays } from 'date-fns';
import { nanoid } from 'nanoid';
import { prisma } from '@/utils';

export async function GET() {
  var seed = nanoid(64);

  const config = await prisma.config.findFirst({});

  if (!config) {
    return NextResponse.json(
      {
        error:
          'The config entity does not exist within the current Database, please create one!',
      },
      {
        status: 400,
      }
    );
  }

  const currentDay = differenceInDays(new Date(config.createdAt), new Date());

  const seeds = await prisma.seed.findMany({
    orderBy: {
      day: 'desc',
    },
  });

  if (!seeds[currentDay]) {
    await prisma.seed.create({
      data: {
        seed,
        day: currentDay,
        config: {
          connect: {
            id: config.id,
          },
        },
      },
    });

    return NextResponse.json('Seed created!', {
      status: 201,
    });
  }

  return NextResponse.json(
    { error: 'Seed already exists!' },
    {
      status: 400,
    }
  );
}
