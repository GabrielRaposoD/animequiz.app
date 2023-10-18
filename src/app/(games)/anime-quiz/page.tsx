import Guess from '@/components/game/game';
import { animeQuizTips } from '@/constants/tips';
import { api } from '@/lib';
import { decryptData } from '@/lib/decryptData';

export default async function AnimeQuiz({
  searchParams,
}: {
  searchParams: { viewport: 'mobile' | 'desktop' };
}) {
  const res = await api('game/anime', {
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
        entity='animes'
        property='title'
        imageSrc={res.data.image}
        tips={animeQuizTips}
        placeholder='Which anime is this?'
        date={new Date(date)}
        seed={res.seed}
        viewport={searchParams?.viewport ?? 'desktop'}
      />
    </section>
  );
}
