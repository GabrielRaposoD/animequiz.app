import { NextRequest, NextResponse } from 'next/server';

import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { prisma } from '@/lib';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(20, '10 s'),
});

export async function GET(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { limit, reset, remaining } = await ratelimit.limit(ip);

  if (remaining < 1) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }

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
    take: 100,
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

  return NextResponse.json(characters, {
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  });
}
