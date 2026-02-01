'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import clsx from 'clsx';

import css from './ShimmerImage.module.css';

//===============================================================

type Props = Omit<ImageProps, 'fill' | 'alt'> & {
  alt: string;
  className?: string;
  wrapClassName?: string;
};

//===============================================================

function ShimmerImage({
  className,
  wrapClassName,
  onLoad,
  alt,
  ...props
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={clsx(css.wrap, wrapClassName)}>
      <Image
        {...props}
        alt={alt}
        fill
        className={clsx(css.img, className)}
        onLoad={(img) => {
          setLoaded(true);
          onLoad?.(img);
        }}
      />

      <div
        className={clsx(css.skeleton, loaded && css.skeletonOff)}
        aria-hidden="true"
      />
    </div>
  );
}

export default ShimmerImage;
