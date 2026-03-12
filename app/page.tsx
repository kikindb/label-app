'use client';

import { jsPDF } from 'jspdf';
import { useEffect, useMemo, useRef, useState } from 'react';
import labelChorizo from './assets/label-chorizo.png';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const future = new Date(today);
    future.setMonth(future.getMonth() + 2);
    const year = future.getFullYear();
    const month = String(future.getMonth() + 1).padStart(2, '0');
    const day = String(future.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [isReady, setIsReady] = useState(false);

  const formattedDate = useMemo(() => {
    if (!selectedDate) return '';
    const [year, month, day] = selectedDate.split('-').map(Number);
    if (!year || !month || !day) return '';
    const monthNames = [
      'ENE',
      'FEB',
      'MAR',
      'ABR',
      'MAY',
      'JUN',
      'JUL',
      'AGO',
      'SEP',
      'OCT',
      'NOV',
      'DIC',
    ];
    const monthLabel = monthNames[month - 1] ?? '';
    const dayLabel = String(day).padStart(2, '0');
    return `${dayLabel} ${monthLabel} ${year}`;
  }, [selectedDate]);

  useEffect(() => {
    const image = new Image();
    image.src = labelChorizo.src;
    image.onload = () => {
      imageRef.current = image;
      setIsReady(true);
    };
  }, []);

  useEffect(() => {
    if (!isReady || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = imageRef.current;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(imageRef.current, 0, 0, width, height);

    if (formattedDate) {
      ctx.font = '24px Arial';
      ctx.fillStyle = '#111111';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText(formattedDate, 1090, 42);
    }
  }, [formattedDate, isReady]);

  const handleGenerate = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    const safeDate = selectedDate || 'sin-fecha';
    link.download = `etiqueta-${safeDate}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handlePrintPdf = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: 'letter',
    });

    const pageWidth = 11;
    const pageHeight = 8.5;
    const cols = 2;
    const rows = 6;

    const marginX = 0.15;
    const marginY = 0.2;
    const gapX = 0.08;
    const gapY = 0.08;

    const availableWidth = pageWidth - marginX * 2 - gapX * (cols - 1);
    const availableHeight = pageHeight - marginY * 2 - gapY * (rows - 1);

    const labelAspect = 1500 / 349;
    const maxLabelWidthFromWidth = availableWidth / cols;
    const maxLabelWidthFromHeight = (availableHeight / rows) * labelAspect;
    const labelWidth = Math.min(maxLabelWidthFromWidth, maxLabelWidthFromHeight);
    const labelHeight = labelWidth / labelAspect;

    const gridWidth = cols * labelWidth + gapX * (cols - 1);
    const gridHeight = rows * labelHeight + gapY * (rows - 1);
    const startX = (pageWidth - gridWidth) / 2;
    const startY = (pageHeight - gridHeight) / 2;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = startX + col * (labelWidth + gapX);
        const y = startY + row * (labelHeight + gapY);
        pdf.addImage(dataUrl, 'PNG', x, y, labelWidth, labelHeight);
      }
    }

    const safeDate = selectedDate || 'sin-fecha';
    pdf.save(`etiquetas-${safeDate}.pdf`);
  };

  return (
    <div className='min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900'>
      <main className='mx-auto flex w-full max-w-5xl flex-col gap-10'>
        <header className='flex flex-col gap-3'>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500'>
            Generador de etiquetas
          </p>
          <h1 className='text-3xl font-semibold leading-tight text-zinc-900 sm:text-4xl'>
            Etiqueta de chorizo con fecha de caducidad
          </h1>
          <p className='max-w-2xl text-base text-zinc-600'>
            Selecciona una fecha y genera la etiqueta lista para descargar en
            formato PNG.
          </p>
        </header>

        <section className='grid gap-8 lg:grid-cols-[1fr_320px]'>
          <div className='flex flex-col gap-4'>
            <div className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm'>
              <canvas
                ref={canvasRef}
                className='h-auto w-full rounded-xl border border-zinc-200 bg-white'
                aria-label='Vista previa de la etiqueta'
              />
            </div>
            <p className='text-sm text-zinc-500'>
              La fecha se agrega junto al texto &quot;Fecha de caducidad:&quot;.
              Ajusta la posición en el código si el diseño cambia.
            </p>
          </div>

          <div className='flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='fecha'
                className='text-sm font-medium text-zinc-700'
              >
                Fecha de caducidad
              </label>
              <input
                id='fecha'
                name='fecha'
                type='date'
                lang='es-MX'
                className='h-11 rounded-xl border border-zinc-300 px-4 text-base text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200'
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
              <span className='text-xs text-zinc-500'>
                Formato mostrado: {formattedDate || 'dd/mm/aaaa'}
              </span>
            </div>

            <div className='flex flex-col gap-3'>
              <button
                type='button'
                onClick={handleGenerate}
                className='h-12 rounded-full bg-zinc-900 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800'
              >
                Generar
              </button>
              <button
                type='button'
                onClick={handlePrintPdf}
                className='h-12 rounded-full border border-zinc-300 bg-white text-sm font-semibold uppercase tracking-wider text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50'
              >
                Imprimir
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
