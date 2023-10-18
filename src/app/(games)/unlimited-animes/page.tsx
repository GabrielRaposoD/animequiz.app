import Unlimited from '@/components/game/unlimited';

export default async function UnlimitedAnimes({
  searchParams,
}: {
  searchParams: { viewport: 'mobile' | 'desktop' };
}) {
  return (
    <section className='flex flex-col items-center border border-zinc-500 rounded-md p-4 w-1/2 mt-16'>
      <Unlimited viewport={searchParams.viewport} type='anime' />
    </section>
  );
}
