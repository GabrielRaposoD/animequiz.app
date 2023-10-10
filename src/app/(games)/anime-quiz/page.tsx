import { Anime } from '@prisma/client';
import GuessAnimeTitle from '@/components/game/guessAnimeTitle';
import getCurrentAnime from '@/services/getCurrentAnime';

export default async function AnimeQuiz() {
  const anime = (await getCurrentAnime()) as Anime;

  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      <GuessAnimeTitle anime={anime} />
    </main>
  );
}
