import { Anime } from '@prisma/client';
import Guess from '@/components/game/guess';
import { animeQuizTips } from '@/constants/tips';
import { getTodaysData } from '@/services';

export default async function AnimeQuiz() {
  const anime = (await getTodaysData('anime')) as Anime;

  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      <Guess
        data={anime}
        entity='animes'
        property='title'
        imageSrc={anime.banner}
        tips={animeQuizTips}
        placeholder='Which anime is this?'
      />
    </main>
  );
}
