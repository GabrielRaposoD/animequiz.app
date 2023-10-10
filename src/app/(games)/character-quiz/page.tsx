import { CharacterWithAnime } from '@/types';
import GuessCharacterName from '@/components/game/guessCharacterName';
import { getCurrentCharacter } from '@/services';

export default async function CharacterQuiz() {
  const character = (await getCurrentCharacter()) as CharacterWithAnime;

  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      <GuessCharacterName character={character} />
    </main>
  );
}
