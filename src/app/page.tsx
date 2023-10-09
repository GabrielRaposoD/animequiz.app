import Game from '@/components/game';
import { getCurrentCharacter } from '@/services';

export default async function Home() {
  const character = await getCurrentCharacter();
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Game character={character} />
    </main>
  );
}
