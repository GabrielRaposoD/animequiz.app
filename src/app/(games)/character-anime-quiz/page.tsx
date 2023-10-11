import { getTimeUntilNewSeed, getTodaysData } from '@/services';

import { CharacterWithAnime } from '@/types';
import Guess from '@/components/game/guess';
import { animeQuizTips } from '@/constants/tips';

export default async function CharacterAnimeQuiz() {
  const { data, seed } = await getTodaysData<CharacterWithAnime>(
    'character',
    2
  );
  const date = await getTimeUntilNewSeed();

  console.log(data);

  return (
    <section className='flex flex-col items-center'>
      <Guess
        data={data.anime}
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
