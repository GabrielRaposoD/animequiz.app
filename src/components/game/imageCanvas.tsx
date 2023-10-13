'use client';

import { useEffect, useRef, useState } from 'react';

import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

type ImageCanvasProps = {
  src: string;
  tries: number;
  correct: boolean;
  canvasWidth?: number;
  canvasHeight?: number;
  viewport: 'mobile' | 'desktop';
};

const ImageCanvas = ({
  src,
  tries = 0,
  correct = false,
  canvasHeight = 350,
  canvasWidth = 225,
  viewport,
}: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContext = useRef<CanvasRenderingContext2D | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && canvasRef.current) {
      if (!canvasContext.current) {
        canvasContext.current = canvasRef.current.getContext('2d');
      }

      setLoaded(false);

      canvasRef.current.width = canvasWidth;
      canvasRef.current.height = canvasHeight;
      canvasRef.current.style.width = `${canvasWidth}px`;
      canvasRef.current.style.height = `${canvasHeight}px`;

      const image = new Image();
      image.src = src;

      canvasContext.current!.filter = `blur(${correct ? 0 : 25 - tries}px)`;

      image.onload = () => {
        setLoaded(true);
        canvasContext.current!.drawImage(
          image,
          0,
          0,
          canvasRef.current!.width,
          canvasRef.current!.height
        );
      };
    }
  }, [src, correct, tries, canvasHeight, canvasWidth]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={cn(
          'rounded-md hidden print:hidden',
          loaded ? 'block' : 'hidden'
        )}
        style={
          viewport === 'mobile'
            ? { filter: `blur(${correct ? 0 : 25 - tries}px)` }
            : {}
        }
      />
      <Skeleton
        className={cn(loaded ? 'hidden' : 'block')}
        style={{
          width: canvasWidth,
          height: canvasHeight,
        }}
      />
    </>
  );
};

export default ImageCanvas;
