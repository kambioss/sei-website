"use client";

import { useState } from "react";

export type ExpandableItem = { title: string; text: string };

type ExpandableListProps = {
  items: ExpandableItem[];
  sectionNumber: string;
  ariaLabel?: string;
};

export function ExpandableList({ items, sectionNumber, ariaLabel }: ExpandableListProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="expandableList" aria-label={ariaLabel}>
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        return (
          <div className={"expandableItem" + (isOpen ? " open" : "")} key={item.title}>
            <button
              type="button"
              className="expandableTrigger"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span className="expandableNumber">{sectionNumber}.{index + 1}</span>
              <span className="expandableTitle">{item.title}</span>
              <span className="expandableIcon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && <p className="expandableText">{item.text}</p>}
          </div>
        );
      })}
    </div>
  );
}
