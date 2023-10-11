import { getTimeUntilNewSeed, getTodaysData } from '@/services';

import { Anime } from '@prisma/client';
import Guess from '@/components/game/guess';
import { animeQuizTips } from '@/constants/tips';

export default async function AnimeQuiz() {
  const { data, seed } = await getTodaysData<Anime>('anime');
  const date = await getTimeUntilNewSeed();

  return (
    <section className='flex flex-col items-center'>
      <Guess
        data={data}
        entity='animes'
        property='title'
        imageSrc={data.banner}
        tips={animeQuizTips}
        placeholder='Which anime is this?'
        date={date}
        seed={seed}
      />
    </section>
  );
}
