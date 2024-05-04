import Unlimited from '@/components/game/unlimited';

export default async function UnlimitedAnimes({
  searchParams,
}: {
  searchParams: { viewport: 'mobile' | 'desktop' };
}) {
  return (
    <section className='flex flex-col items-center border border-zinc-500 rounded-md md:p-4 p-3 lg:w-1/2 w-[90%] mt-16'>
      <Unlimited viewport={searchParams.viewport} type='anime' />
    </section>
  );
}
