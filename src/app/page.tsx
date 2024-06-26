import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const nav = [
  {
    label: 'Character',
    href: 'character-quiz',
    description: "Guess today's character",
  },
  {
    label: 'Character Anime',
    href: 'character-anime-quiz',
    description: "Guess today's character anime",
  },
  {
    label: 'Anime',
    href: 'anime-quiz',
    description: "Guess today's anime",
  },
  {
    label: 'Unlimited Characters',
    href: 'unlimited-characters',
    description: "Guess until you can't guess anymore",
  },
  {
    label: 'Unlimited Animes',
    href: 'unlimited-animes',
    description: "Guess until you can't guess anymore",
  },
];

export default async function Home() {
  return (
    <section className='flex flex-col items-center flex-1'>
      <Card className='mt-16 bg-gradient-to-tr from-card via-zinc-600/20 to-card'>
        <CardHeader className='text-center'>
          <CardTitle className='font-danielbd text-4xl'>Welcome!</CardTitle>
          <CardDescription>Put your anime knowledge to work</CardDescription>
        </CardHeader>
        <CardContent>
          <h1 className='md:text-lg font-medium text-center'></h1>
          <ul className='flex flex-col gap-y-3 mt-8'>
            {nav.map((item) => (
              <li className='w-full' key={item.href}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className='w-full'>
                      <Button
                        asChild
                        className='w-full md:text-base'
                        size={'lg'}
                      >
                        <Link href={item.href}>{item.label}</Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
