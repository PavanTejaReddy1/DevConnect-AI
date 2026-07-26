import { useEffect, useState } from 'react';

/**
 * Observes a set of section ids and returns whichever one currently occupies
 * the "active" band near the top of the viewport. Used to highlight the
 * matching navbar link as the user scrolls.
 *
 * Some target sections are code-split and mount after initial render, so a
 * MutationObserver watches for them to appear and (re)attaches the
 * IntersectionObserver once all ids are present.
 */
export default function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    let intersectionObserver;

    const attachIfReady = () => {
      const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
      if (elements.length === 0) return false;

      intersectionObserver?.disconnect();
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting);
          if (visible.length > 0) {
            const topMost = visible.reduce((a, b) =>
              a.boundingClientRect.top < b.boundingClientRect.top ? a : b
            );
            setActiveId(topMost.target.id);
          }
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      );
      elements.forEach((el) => intersectionObserver.observe(el));

      return elements.length === sectionIds.length;
    };

    const allFound = attachIfReady();

    // Keep watching the DOM until every lazy-loaded section has mounted.
    let mutationObserver;
    if (!allFound) {
      mutationObserver = new MutationObserver(() => {
        if (attachIfReady()) mutationObserver.disconnect();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      intersectionObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [sectionIds]);

  return activeId;
}
