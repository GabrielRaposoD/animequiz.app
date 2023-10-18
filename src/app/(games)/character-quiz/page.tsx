import Guess from '@/components/game/game';
import { api } from '@/lib';
import { characterQuizTips } from '@/constants/tips';
import { decryptData } from '@/lib/decryptData';

export default async function CharacterQuiz({
  searchParams,
}: {
  searchParams: { viewport: 'mobile' | 'desktop' };
}) {
  const res = await api('game/character', {
    next: {
      revalidate: 600,
    },
  })
    .then((res) => res.json())
    .then(async (res) => await decryptData(res));

  const date = await api('game/time', {
    next: {
      revalidate: 600,
    },
  }).then((res) => res.json());

  return (
    <section className='flex flex-col items-center'>
      <Guess
        data={res.data}
        entity='characters'
        property='name'
        imageSrc={res.data.image}
        tips={characterQuizTips}
        placeholder='Which character is this?'
        date={new Date(date)}
        seed={res.seed}
        viewport={searchParams?.viewport ?? 'desktop'}
      />
    </section>
  );
}
