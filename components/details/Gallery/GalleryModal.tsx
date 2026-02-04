'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import css from './GalleryModal.module.css';

//===============================================================

type Props = {
  images: string[];
  startIndex: number;
  onClose: () => void;
};

//===============================================================

function clampIndex(i: number, len: number) {
  if (len === 0) return 0;
  return ((i % len) + len) % len;
}

//===============================================================

function GalleryModal({ images, startIndex, onClose }: Props) {
  const total = images.length;

  const safeStart = useMemo(
    () => clampIndex(startIndex ?? 0, total),
    [startIndex, total]
  );

  const [index, setIndex] = useState(safeStart);
  useEffect(() => setIndex(safeStart), [safeStart]);

  const prev = () => setIndex((i) => clampIndex(i - 1, total));
  const next = () => setIndex((i) => clampIndex(i + 1, total));

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, onClose]);

  if (!total) return null;

  return (
    <div
      className={css.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery modal"
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={css.close}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={`${css.arrow} ${css.arrowLeft}`}
          onClick={prev}
          aria-label="Previous image"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>

        <div className={css.imageWrap}>
          <Image
            key={images[index]}
            src={images[index]}
            alt={`Gallery image ${index + 1} of ${total}`}
            fill
            className={css.image}
            sizes="(max-width: 900px) 90vw, 900px"
            priority
          />
        </div>

        <button
          type="button"
          className={`${css.arrow} ${css.arrowRight}`}
          onClick={next}
          aria-label="Next image"
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>

        <div className={css.dots} aria-label="Image pagination">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${css.dot} ${i === index ? css.dotActive : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>

        <div className={css.counter}>
          {index + 1} / {total}
        </div>
      </div>
    </div>
  );
}

export default GalleryModal;
