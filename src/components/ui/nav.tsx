import Image from 'next/image';
import Link from 'next/link';

const Nav = () => {
  return (
    <nav className='flex flex-row items-center justify-center w-full'>
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
    </nav>
  );
};

export default Nav;
