"use client";

import { useState } from "react";

type KnowUs = { title: string; paragraphs: string[] };
type History = { title: string; paragraphs: string[] };
type Values = { title: string; pillars: string[]; text: string };
type Vision = { title: string; text: string };

type AboutTabsProps = {
  knowUs: KnowUs;
  history: History;
  values: Values;
  vision: Vision;
  ambition: string;
  ambitionLabel: string;
};

const TAB_KEYS = ["knowUs", "history", "values", "vision"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export function AboutTabs({ knowUs, history, values, vision, ambition, ambitionLabel }: AboutTabsProps) {
  const [active, setActive] = useState<TabKey>("knowUs");
  const labels: Record<TabKey, string> = { knowUs: knowUs.title, history: history.title, values: values.title, vision: vision.title };

  return (
    <div className="aboutTabs">
      <div className="aboutTabsNav" role="tablist">
        {TAB_KEYS.map((key, index) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            className={"aboutTabButton" + (active === key ? " active" : "")}
            onClick={() => setActive(key)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>{labels[key]}
          </button>
        ))}
      </div>

      <div className="aboutTabPanel" role="tabpanel">
        {active === "knowUs" && (
          <div className="tabPanelInner tabKnowUs">
            {knowUs.paragraphs.map((paragraph, index) => (
              <p className={index === 0 ? "aboutLead" : undefined} key={paragraph}>{paragraph}</p>
            ))}
            <blockquote><span>{ambitionLabel}</span>{ambition}</blockquote>
          </div>
        )}

        {active === "history" && (
          <div className="tabPanelInner tabHistory">
            {history.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        )}

        {active === "values" && (
          <div className="tabPanelInner tabValues">
            <div className="valuesGrid">
              {values.pillars.map((pillar, index) => (
                <div className="valueCard" key={pillar}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{pillar}</strong>
                </div>
              ))}
            </div>
            <p>{values.text}</p>
          </div>
        )}

        {active === "vision" && (
          <div className="tabPanelInner tabVision">
            <p>{vision.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
