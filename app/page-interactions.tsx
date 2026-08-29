"use client";

import { useEffect } from "react";

export function PageInteractions() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".siteHeader");
    const mobileMenu = document.querySelector<HTMLDetailsElement>(".mobileMenu");
    const historyVideo = document.querySelector<HTMLVideoElement>("#notre-histoire .heroVisual video");
    if (historyVideo) historyVideo.playbackRate = 0.15;
    const targets = document.querySelectorAll<HTMLElement>([
      ".heroCopy",
      ".heroVisual",
      ".aboutTitle",
      ".aboutCopy",
      ".aboutFeatureCopy",
      ".aboutFeatureMedia",
      ".historyIntro",
      ".valuesSection .sectionIntro",
      ".valuesGrid",
      ".valuesText",
      ".founderLetter",
      ".expertiseSection .sectionIntro",
      ".domainGalleryGrid .domainCard",
      ".approachIntro",
      ".approachGrid article",
      ".approachClosing",
      ".projectsIntro",
      ".projectsGrid article",
      ".newsSection .sectionIntro",
      ".newsArchiveIntro",
      ".newsCard",
      ".midCta",
      ".organizationsIntro",
      ".organizationSlider",
      ".projectForm",
    ].join(","));

    const revealVariants = ["revealFromRight", "revealFromLeft", "revealFromBottom", "revealScale", "revealDiagonal"];
    const revealDurations = [1150, 1350, 1500, 1250, 1450];

    targets.forEach((target, index) => {
      target.classList.add("revealItem", revealVariants[index % revealVariants.length]);
      target.style.setProperty("--reveal-delay", `${(index % 4) * 140}ms`);
      target.style.setProperty("--reveal-duration", String(revealDurations[index % revealDurations.length]) + "ms");
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

    const closeMobileMenuOutside = (event: PointerEvent) => {
      if (!mobileMenu?.open || !(event.target instanceof Node) || mobileMenu.contains(event.target)) return;
      mobileMenu.open = false;
    };
    document.addEventListener("pointerdown", closeMobileMenuOutside);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", closeMobileMenuOutside);
    };
  }, []);

  return null;

}
