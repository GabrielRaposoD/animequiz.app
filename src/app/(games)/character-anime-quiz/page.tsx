import { CharacterWithAnime } from '@/types';
import Guess from '@/components/game/guess';
import { animeQuizTips } from '@/constants/tips';
import { getTodaysData } from '@/services';

export default async function CharacterAnimeQuiz() {
  const character = (await getTodaysData('character', 2)) as CharacterWithAnime;

  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      <Guess
        data={character.anime}
        entity='animes'
        property='title'
        imageSrc={character.image}
        tips={animeQuizTips}
        placeholder='Which anime is this character from?'
      />
    </main>
  );
}
