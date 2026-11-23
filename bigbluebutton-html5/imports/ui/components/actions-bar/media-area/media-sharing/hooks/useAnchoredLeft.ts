import { RefObject, useLayoutEffect, useState } from 'react';

const VIEWPORT_MARGIN = 8; // px

// Horizontal position that centers an element above its anchor, kept inside the
// window. Returns undefined while there is nothing to measure.
const useAnchoredLeft = (
  anchorRef: RefObject<HTMLElement>,
  elementRef: RefObject<HTMLElement>,
  enabled: boolean,
): number | undefined => {
  const [left, setLeft] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const element = elementRef.current;
    if (!enabled || !anchor || !element) {
      setLeft(undefined);
      return undefined;
    }

    const update = () => {
      const anchorRect = anchor.getBoundingClientRect();
      const { offsetWidth } = element;
      const centered = anchorRect.left + anchorRect.width / 2 - offsetWidth / 2;
      const max = window.innerWidth - offsetWidth - VIEWPORT_MARGIN;
      setLeft(Math.round(Math.max(VIEWPORT_MARGIN, Math.min(centered, max))));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    observer.observe(document.documentElement);
    // The button moves with the bar, e.g. when a side panel opens or is resized.
    const bar = anchor.closest('#ActionsBar');
    if (bar) observer.observe(bar);

    return () => observer.disconnect();
  }, [enabled]);

  return left;
};

export default useAnchoredLeft;
