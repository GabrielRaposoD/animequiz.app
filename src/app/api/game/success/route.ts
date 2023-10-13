import { NextRequest, NextResponse } from 'next/server';

import { Prisma } from '@prisma/client';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { prisma } from '@/lib';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(2, '10 s'),
});

export async function POST(request: NextRequest) {
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

  const res = await request.json();

  const seed = await prisma.seed.findUnique({
    where: {
      id: res.seedId,
    },
  });

  if (!seed) {
    return NextResponse.json({ error: 'Seed not found' }, { status: 400 });
  }

  const info = seed.info as Prisma.JsonArray;

  info.forEach((i: any) => {
    if (i['game'] === res.game) {
      i['success'] = i['success'] + 1;
      i['tries'] = i['tries'] + res.tries;
    }
  });

  await prisma.seed.update({
    where: {
      id: res.seedId,
    },
    data: {
      info,
    },
  });

  return NextResponse.json('success', {
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  });
}
