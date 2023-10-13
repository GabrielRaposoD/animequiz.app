import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get('name');

  const characters = await prisma.character.findMany({
    where: {
      NOT: [
        {
          image: {
            contains:
              'https://s4.anilist.co/file/anilistcdn/character/large/default.jpg',
          },
        },
      ],
      OR: [
        {
          name: {
            startsWith: query || '',
            mode: 'insensitive',
          },
        },
        {
          animes: {
            some: {
              title: {
                contains: query || '',
                mode: 'insensitive',
              },
            },
          },
        },
        {
          animes: {
            some: {
              sequels: {
                some: {
                  title: {
                    contains: query || '',
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        },
      ],
    },
    orderBy: {
      name: 'asc',
    },
    take: 300,
    include: {
      animes: {
        take: 1,
        orderBy: {
          year: 'desc',
        },
        include: {
          sequels: true,
        },
      },
    },
  });

  return NextResponse.json(characters);
}
