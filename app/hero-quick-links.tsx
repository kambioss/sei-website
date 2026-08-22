"use client";

import { useState } from "react";

type QuickLinkItem = { id: string; href: string; icon: "history" | "values" | "vision"; label: string; heading: string; text: string };

const ICONS: Record<QuickLinkItem["icon"], React.ReactNode> = {
  history: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3.2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  values: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 19.5s-7.5-4.4-7.5-9.8A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.7c0 5.4-7.5 9.8-7.5 9.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  vision: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
};

export function HeroQuickLinks({ items, moreLabel }: { items: QuickLinkItem[]; moreLabel: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = items.find((item) => item.id === activeId) ?? null;

  return (
    <div className="heroQuickLinks">
      <div className="heroQuickLinksRow" role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeId === item.id}
            className={"heroQuickLinkButton" + (activeId === item.id ? " active" : "")}
            onClick={() => setActiveId((current) => (current === item.id ? null : item.id))}
          >
            <span className="heroQuickLinkIcon">{ICONS[item.icon]}</span>
            {item.label}
          </button>
        ))}
      </div>
      {active && (
        <div className="heroQuickLinkPanel">
          <h3>{active.heading}</h3>
          <p>{active.text}</p>
          <a href={active.href}>{moreLabel} <span aria-hidden="true">→</span></a>
        </div>
      )}
    </div>
  );
}
