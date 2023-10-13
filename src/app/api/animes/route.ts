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

  const query = searchParams.get('title');

  const animes = await prisma.anime.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query || '',
            mode: 'insensitive',
          },
        },
        {
          sequels: {
            some: {
              title: {
                contains: query || '',
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    },
    orderBy: {
      title: 'asc',
    },
    take: 100,
  });

  return NextResponse.json(animes, {
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  });
}
