import { getTimeUntilNewSeed, getTodaysData } from '@/services';

import { CharacterWithAnimes } from '@/types';
import Guess from '@/components/game/guess';
import { animeQuizTips } from '@/constants/tips';

export default async function CharacterAnimeQuiz() {
  const { data, seed } = await getTodaysData<CharacterWithAnimes>(
    'character',
    2
  );
  const date = await getTimeUntilNewSeed();

  return (
    <section className='flex flex-col items-center'>
      <Guess
        data={data.animes[0]}
        entity='animes'
        property='title'
        imageSrc={data.image}
        tips={animeQuizTips}
        placeholder='Which anime is this character from?'
        date={date}
        seed={seed}
      />
    </section>
  );
}
