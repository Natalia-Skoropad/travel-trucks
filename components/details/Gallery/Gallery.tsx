'use client';

import { useState } from 'react';

import GalleryModal from './GalleryModal';
import ShimmerImage from '@/components/common/ShimmerImage/ShimmerImage';
import css from './Gallery.module.css';

//===============================================================

type Props = {
  images: string[];
};

//===============================================================

function Gallery({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <ul className={css.list}>
        {images.slice(0, 4).map((src, index) => (
          <li key={src} className={css.item}>
            <button
              type="button"
              className={css.imageBtn}
              onClick={() => setActiveIndex(index)}
            >
              <ShimmerImage
                as="span"
                src={src}
                alt=""
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </button>
          </li>
        ))}
      </ul>

      {activeIndex !== null && (
        <GalleryModal
          images={images}
          startIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </>
  );
}

export default Gallery;
