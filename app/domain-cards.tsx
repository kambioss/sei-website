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

export function DomainCards({ items }: { items: DomainItem[] }) {
  return (
    <div className="domainGalleryGrid">
      {items.map((item) => (
        <DomainCard key={item.src} item={item} />
      ))}
    </div>
  );
}

function DomainCard({ item }: { item: DomainItem }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={"domainCard " + item.tone} role="group" aria-label={item.title}>
      <div className="domainCardInner">
        <div className="domainCardFace domainCardFront">
          <Image src={item.src} alt={item.title} fill unoptimized sizes="(max-width: 680px) 100vw, 33vw" />
          <span className="domainCardCaption">{item.title}</span>
        </div>
        <div className="domainCardFace domainCardBack">
          <h3>{item.title}</h3>
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
