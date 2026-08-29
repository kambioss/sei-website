"use client";

import { useState } from "react";
import Image from "next/image";

type Intervention = { title: string; text: string };

type DomainItem = {
  src: string;
  title: string;
  summary: string;
  interventions: Intervention[];
  impact: string;
  impactLabel: string;
  tone: string;
};

export function DomainCards({ items, english }: { items: DomainItem[]; english: boolean }) {
  return (
    <div className="domainGalleryGrid">
      {items.map((item) => (
        <DomainCard key={item.src} item={item} english={english} />
      ))}
    </div>
  );
}

function DomainCard({ item, english }: { item: DomainItem; english: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={"domainCard " + item.tone}
      role="group"
      aria-label={item.title}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" || event.pointerType === "pen") setIsFlipped(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" || event.pointerType === "pen") setIsFlipped(false);
      }}
      onFocus={() => setIsFlipped(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFlipped(false);
      }}
    >
      <div className={"domainCardInner" + (isFlipped ? " isFlipped" : "")}>
        <div className="domainCardFace domainCardFront" onClick={() => setIsFlipped(true)}>
          <Image src={item.src} alt="" fill unoptimized sizes="(max-width: 680px) 100vw, 33vw" />
          <span className="domainCardCaption" aria-hidden="true">{item.title}</span>
          <button
            type="button"
            className="domainCardFrontBtn"
            aria-label={english ? "View card details" : "Voir les détails de la carte"}
            onClick={(event) => {
              event.stopPropagation();
              setIsFlipped(true);
            }}
          >
            <span aria-hidden="true">↻</span>
          </button>
        </div>
        <div
          className="domainCardFace domainCardBack"
          aria-hidden={!isFlipped}
          onClick={(event) => {
            if (!(event.target as HTMLElement).closest("button")) setIsFlipped(false);
          }}
        >
          <button
            type="button"
            className="domainCardBackBtn"
            aria-label={english ? "Back to front" : "Retourner la carte"}
            onClick={() => setIsFlipped(false)}
          >
            <span aria-hidden="true">↺</span>
          </button>
          <p className="domainCardSummary">{item.summary}</p>
          <ul className="domainCardInterventions">
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
          <div className="domainCardImpact">
            <strong>{item.impactLabel}</strong>
            <p>{item.impact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
