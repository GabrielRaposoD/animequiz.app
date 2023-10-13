import { NextRequest, userAgent } from 'next/server';
import { getTimeUntilNewSeed, getTodaysData } from '@/services';

import { Anime } from '@prisma/client';
import Guess from '@/components/game/guess';
import { animeQuizTips } from '@/constants/tips';

export default async function AnimeQuiz({
  searchParams,
}: {
  searchParams: { viewport: 'mobile' | 'desktop' };
}) {
  const { data, seed } = await getTodaysData<Anime>('anime');
  const date = await getTimeUntilNewSeed();
  console.log(searchParams.viewport);

  return (
    <section className='flex flex-col items-center'>
      <Guess
        data={data}
        entity='animes'
        property='title'
        imageSrc={data.image}
        tips={animeQuizTips}
        placeholder='Which anime is this?'
        date={date}
        seed={seed}
        viewport={searchParams.viewport}
      />
    </section>
  );
}
