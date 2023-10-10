import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get('name');

  const characters = await prisma.character.findMany({
    where: {
      name: {
        contains: query || '',
        mode: 'insensitive',
      },
    },
    orderBy: {
      name: 'asc',
    },
    take: 100,
    include: {
      anime: true,
    },
  });

  return NextResponse.json(characters);
}
