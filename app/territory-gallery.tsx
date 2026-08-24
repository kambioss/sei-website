"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryItem = {
  src: string;
  title: string;
  summary: string;
  href: string;
};

export function TerritoryGallery({
  items,
  flipLabel,
  closeLabel,
  moreLabel,
}: {
  items: GalleryItem[];
  flipLabel: string;
  closeLabel: string;
  moreLabel: string;
}) {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  return (
    <div className="territoryGalleryGrid">
      {items.map((item, index) => {
        const isFlipped = flippedIndex === index;
        return (
          <div className={"territoryCard" + (isFlipped ? " flipped" : "")} key={item.src}>
            <div className="territoryCardInner">
              <button
                type="button"
                className="territoryCardFace territoryCardFront"
                aria-label={`${item.title} — ${flipLabel}`}
                tabIndex={isFlipped ? -1 : 0}
                onClick={() => setFlippedIndex(index)}
              >
                <Image src={item.src} alt={item.title} fill unoptimized sizes="(max-width: 680px) 100vw, 33vw" />
                <span className="territoryCardCaption">{item.title}</span>
              </button>
              <div className="territoryCardFace territoryCardBack" aria-hidden={!isFlipped}>
                <button
                  type="button"
                  className="territoryCardBackClose"
                  aria-label={closeLabel}
                  tabIndex={isFlipped ? 0 : -1}
                  onClick={() => setFlippedIndex(null)}
                >
                  ×
                </button>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <a href={item.href} tabIndex={isFlipped ? 0 : -1}>
                  {moreLabel} <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
