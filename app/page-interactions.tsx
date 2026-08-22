"use client";

import { useEffect } from "react";

export function PageInteractions({ backToTopLabel }: { backToTopLabel: string }) {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".siteHeader");
    const backToTop = document.querySelector<HTMLElement>(".backToTop");
    const targets = document.querySelectorAll<HTMLElement>([
      ".heroCopy",
      ".heroVisual",
      ".aboutTitle",
      ".aboutCopy",
      ".aboutFeatureCopy",
      ".aboutFeatureMedia",
      ".historyIntro",
      ".historyColumns",
      ".founderLetter",
      ".territoryGalleryIntro",
      ".territoryGalleryGrid figure",
      ".expertiseSection .sectionIntro",
      ".expertiseCard",
      ".approachIntro",
      ".approachGrid article",
      ".capabilitiesSection > div",
      ".capabilitiesSection li",
      ".projectsIntro",
      ".projectsGrid article",
      ".newsSection .sectionIntro",
      ".newsArchiveIntro",
      ".newsCard",
      ".midCta",
      ".organizationsIntro",
      ".organizationSlider",
      ".contactCopy",
      ".projectForm",
    ].join(","));

    targets.forEach((target, index) => {
      target.classList.add("revealItem");
      target.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("inView");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -9%", threshold: 0.08 });
    targets.forEach((target) => observer.observe(target));

    const onScroll = () => {
      const active = window.scrollY > 40;
      header?.classList.toggle("scrolled", active);
      backToTop?.classList.toggle("visible", window.scrollY > 650);

      const sectionIds = ["sei", "expertises", "approche", "projets", "actualites"];
      const threshold = (header?.offsetHeight ?? 0) + 140;
      let activeSection = "";
      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= threshold) activeSection = id;
      });
      if (activeSection) {
        document.querySelectorAll<HTMLElement>("[data-nav-section]").forEach((link) => {
          const selected = link.dataset.navSection === activeSection;
          link.classList.toggle("active", selected);
          if (selected) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  return <button className="backToTop" type="button" aria-label={backToTopLabel} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>;

}
