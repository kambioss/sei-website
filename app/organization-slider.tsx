"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Organization = {
  name: string;
  description: string;
  logoUrl: string;
  link: string;
};

type OrganizationSliderProps = {
  items: Organization[];
  previousLabel: string;
  nextLabel: string;
  visitLabel: string;
};

export function OrganizationSlider({ items, previousLabel, nextLabel, visitLabel }: OrganizationSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), 5200);
    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  if (!items.length) return null;
  const item = items[index];
  const initials = item.name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();

  return (
    <div
      className="organizationSlider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <article className="organizationSlide">
        <div
          className={item.logoUrl ? "organizationLogo hasImage" : "organizationLogo"}
          style={item.logoUrl ? { backgroundImage: `url(${JSON.stringify(item.logoUrl).slice(1, -1)})` } : undefined}
          role={item.logoUrl ? "img" : undefined}
          aria-label={item.logoUrl ? item.name : undefined}
        >
          {!item.logoUrl && <span>{initials || "SEI"}</span>}
        </div>
        <div className="organizationCopy">
          <span className="organizationNumber">{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          {item.link && <Link href={item.link} target="_blank" rel="noreferrer">{visitLabel} <span aria-hidden="true">↗</span></Link>}
        </div>
      </article>
      {items.length > 1 && (
        <div className="organizationControls">
          <button type="button" onClick={() => setIndex((index - 1 + items.length) % items.length)} aria-label={previousLabel}>←</button>
          <div>{items.map((organization, itemIndex) => <button key={organization.name + itemIndex} className={itemIndex === index ? "active" : ""} onClick={() => setIndex(itemIndex)} aria-label={String(itemIndex + 1)} />)}</div>
          <button type="button" onClick={() => setIndex((index + 1) % items.length)} aria-label={nextLabel}>→</button>
        </div>
      )}
    </div>
  );
}
