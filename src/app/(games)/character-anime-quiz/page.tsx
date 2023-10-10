import { CharacterWithAnime } from '@/types';
import GuessCharacterAnimeTitle from '@/components/game/guessCharacterAnimeTitle';
import getCurrentCharacterAnime from '@/services/getCurrentCharacterAnime';

export default async function CharacterAnimeQuiz() {
  const character = (await getCurrentCharacterAnime()) as CharacterWithAnime;

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <GuessCharacterAnimeTitle character={character} />
    </main>
  );
}
