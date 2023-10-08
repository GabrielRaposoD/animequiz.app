'use client';

import { useEffect, useRef } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = 225 * 1.5;
      canvasRef.current.height = 350 * 1.5;
      canvasRef.current.style.width = `${225 * 1.5}px`;
      canvasRef.current.style.height = `${350 * 1.5}px`;

      const image = new Image();
      image.src =
        'https://cdn.myanimelist.net/images/characters/9/72533.jpg?s=d38cf4e2e5cbb46ddaf2b23345a03eae';

      context!.filter = 'blur(25px)';

      image.onload = () => {
        context!.drawImage(
          image,
          0,
          0,
          canvasRef.current!.width,
          canvasRef.current!.height
        );
      };
    }
  }, []);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <canvas ref={canvasRef} />
    </main>
  );
}
