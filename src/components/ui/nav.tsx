'use client';

import { ChevronLeft } from 'lucide-react';
import HelpDialog from '../game/helpDialog';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Nav = () => {
  const path = usePathname();
  return (
    <nav className='flex flex-row items-center justify-center gap-x-3 w-full'>
      {path !== '/' ? (
        <Link href='/' className={path !== '/' ? 'block' : 'hidden'}>
          <ChevronLeft
            size={48}
            className='opacity-70 hover:opacity-100 transition-all duration-500'
          />
        </Link>
      ) : (
        <span className='w-12' />
      )}

      <Link
        href='/'
        className='relative transition-all duration-500 hover:-translate-y-3 hover:scale-110 cursor-pointer flex items-center justify-center overflow-hidden w-[300px] md:w-[400px] h-[100px]'
      >
        <Image
          src='logo.svg'
          alt='Anime Quiz Logo'
          width={1024}
          height={1024}
          className='md:h-[500px] h-[400px] object-cover'
        />
      </Link>
      <HelpDialog />
    </nav>
  );
};

export default Nav;
