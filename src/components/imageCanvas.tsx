'use client';

import { useEffect, useRef } from 'react';

type ImageCanvasProps = {
  src: string;
  tries: number;
  correct: boolean;
};

const ImageCanvas = ({ src, tries = 0, correct = false }: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContext = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && canvasRef.current) {
      if (!canvasContext.current) {
        canvasContext.current = canvasRef.current.getContext('2d');
      }

      canvasRef.current.width = 225 * 1.3;
      canvasRef.current.height = 350 * 1.3;
      canvasRef.current.style.width = `${225 * 1.3}px`;
      canvasRef.current.style.height = `${350 * 1.3}px`;

      const image = new Image();
      image.src = src;

      canvasContext.current!.filter = `blur(${correct ? 0 : 25 - tries}px)`;

      image.onload = () => {
        canvasContext.current!.drawImage(
          image,
          0,
          0,
          canvasRef.current!.width,
          canvasRef.current!.height
        );
      };
    }
  }, [src, correct, tries]);

  return <canvas ref={canvasRef} />;
};

export default ImageCanvas;
