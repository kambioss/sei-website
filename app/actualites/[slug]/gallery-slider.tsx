"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type GallerySliderProps = {
  images: Array<{ url: string; alt: string }>;
  galleryLabel: string;
  previousLabel: string;
  nextLabel: string;
};

export function GallerySlider({ images, galleryLabel, previousLabel, nextLabel }: GallerySliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % images.length), 5000);
    return () => window.clearInterval(timer);
  }, [images.length, paused]);

  if (!images.length) return null;
  const current = images[index];

  return (
    <section
      className="gallerySlider"
      aria-label={galleryLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <header className="galleryHeader">
        <span className="galleryLabel">{galleryLabel}</span>
        <span className="galleryCounter" aria-live="polite"><strong>{index + 1}</strong> / {images.length}</span>
      </header>
      <div className="galleryStage">
        <div className="gallerySlide">
          <Image src={current.url} alt={current.alt} fill unoptimized sizes="(max-width: 1100px) 100vw, 1040px" />
        </div>
        {images.length > 1 && (
          <>
            <button type="button" className="galleryPrevious" aria-label={previousLabel} onClick={() => setIndex((index - 1 + images.length) % images.length)}>←</button>
            <button type="button" className="galleryNext" aria-label={nextLabel} onClick={() => setIndex((index + 1) % images.length)}>→</button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="galleryDots" aria-label={String(index + 1) + " / " + String(images.length)}>
          {images.map((image, imageIndex) => (
            <button key={image.url} type="button" className={imageIndex === index ? "active" : ""} onClick={() => setIndex(imageIndex)} aria-label={String(imageIndex + 1)} />
          ))}
        </div>
      )}
    </section>
  );
}
