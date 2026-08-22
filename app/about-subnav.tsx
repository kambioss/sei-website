"use client";

import { useEffect, useState } from "react";

export type SubnavItem = { id: string; label: string };

export function AboutSubnav({ items }: { items: SubnavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-150px 0px -65% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="aboutSubnav" aria-label="Sections de la page">
      <div className="sectionShell aboutSubnavInner">
        {items.map((item) => (
          <a key={item.id} href={"#" + item.id} className={active === item.id ? "active" : undefined}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
