import { NextRequest, NextResponse } from 'next/server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib';

export async function POST(request: NextRequest) {
  const res = await request.json();

  const seed = await prisma.seed.findUnique({
    where: {
      id: Number(res.seedId),
    },
  });

  if (!seed) {
    return NextResponse.json({ error: 'Seed not found' }, { status: 400 });
  }

  const info = seed.info as Prisma.JsonArray;

  info.forEach((i: any) => {
    if (i['game'] === res.game) {
      const tries = i['tries'] ?? 0;
      i['success'] = i['success'] + 1;
      i['tries'] = i['tries'] + tries;
    }
  });

  console.log(info);

  // await prisma.seed.update({
  //   where: {
  //     id: Number(res.seedId),
  //   },
  //   data: {
  //     info,
  //   },
  // });

  return NextResponse.json('success');
}
