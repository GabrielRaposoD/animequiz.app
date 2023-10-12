import { getTimeUntilNewSeed, getTodaysData } from '@/services';

import { CharacterWithAnimes } from '@/types';
import Guess from '@/components/game/guess';
import { characterQuizTips } from '@/constants/tips';

export default async function CharacterQuiz() {
  const { data, seed } = await getTodaysData<CharacterWithAnimes>('character');
  const date = await getTimeUntilNewSeed();

  return (
    <section className='flex flex-col items-center'>
      <Guess
        data={data}
        entity='characters'
        property='name'
        imageSrc={data.image}
        tips={characterQuizTips}
        placeholder='Which character is this?'
        date={date}
        seed={seed}
      />
    </section>
  );
}
