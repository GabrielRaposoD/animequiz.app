import { CharacterWithAnime } from '@/types';
import Guess from '@/components/game/guess';
import { characterQuizTips } from '@/constants/tips';
import { getTodaysData } from '@/services';

export default async function CharacterQuiz() {
  const character = (await getTodaysData('character')) as CharacterWithAnime;

  return (
    <section className='flex flex-col items-center'>
      <Guess
        data={character}
        entity='characters'
        property='slug'
        imageSrc={character.image}
        tips={characterQuizTips}
        placeholder='Which character is this?'
      />
    </section>
  );
}
