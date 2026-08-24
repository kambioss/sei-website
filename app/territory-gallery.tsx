"use client";

import { useState } from "react";
import Image from "next/image";

type Intervention = { title: string; text: string };

type GalleryItem = {
  src: string;
  title: string;
  summary: string;
  interventions: Intervention[];
};

export function TerritoryGallery({ items }: { items: GalleryItem[] }) {
  return (
    <div className="territoryGalleryGrid">
      {items.map((item) => (
        <TerritoryCard key={item.src} item={item} />
      ))}
    </div>
  );
}

function TerritoryCard({ item }: { item: GalleryItem }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="territoryCard" role="group" aria-label={item.title}>
      <div className="territoryCardInner">
        <div className="territoryCardFace territoryCardFront">
          <Image src={item.src} alt={item.title} fill unoptimized sizes="(max-width: 680px) 100vw, 33vw" />
          <span className="territoryCardCaption">{item.title}</span>
        </div>
        <div className="territoryCardFace territoryCardBack">
          <h3>{item.title}</h3>
          <p className="territoryCardSummary">{item.summary}</p>
          <ul className="territoryCardInterventions">
            {item.interventions.map((entry, index) => {
              const isOpen = openIndex === index;
              return (
                <li className={isOpen ? "open" : ""} key={entry.title}>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpenIndex(isOpen ? null : index)}>
                    <span>{entry.title}</span>
                    <i aria-hidden="true">{isOpen ? "−" : "+"}</i>
                  </button>
                  {isOpen && <p>{entry.text}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
