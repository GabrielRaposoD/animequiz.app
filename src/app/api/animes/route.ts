import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get('title');

  const animes = await prisma.anime.findMany({
    where: {
      title: {
        contains: query || '',
        mode: 'insensitive',
      },
    },
  });

  return NextResponse.json(animes);
}
