import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

const MARGIN = 16;
const KEYBOARD_STEP = 24;
const DRAG_THRESHOLD = 4;

export interface Bounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Share of the free space before the element, from 0 to 1 on each axis */
export interface Position {
  x: number;
  y: number;
}

interface Drag {
  pointerId: number;
  startX: number;
  startY: number;
  left: number;
  top: number;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

// The position is kept as a share of the free space, so the element stays
// inside the bounds when a panel opens, the window resizes or it is minimized.
const useFloatingPosition = (
  bounds: Bounds,
  position: Position,
  setPosition: (position: Position) => void,
) => {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const wasDragged = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const { current: element } = ref;
    if (!element) return undefined;
    const measure = () => setSize({
      width: element.offsetWidth,
      height: element.offsetHeight,
    });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const freeWidth = Math.max(0, bounds.width - size.width - MARGIN * 2);
  const freeHeight = Math.max(0, bounds.height - size.height - MARGIN * 2);
  const originLeft = bounds.left + MARGIN;
  const originTop = bounds.top + MARGIN;
  const left = originLeft + position.x * freeWidth;
  const top = originTop + position.y * freeHeight;

  const moveTo = useCallback((newLeft: number, newTop: number) => {
    setPosition({
      x: freeWidth ? clamp((newLeft - originLeft) / freeWidth) : position.x,
      y: freeHeight ? clamp((newTop - originTop) / freeHeight) : position.y,
    });
  }, [freeWidth, freeHeight, originLeft, originTop, position, setPosition]);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    wasDragged.current = false;
    if (event.button !== 0) return;
    const control = (event.target as HTMLElement).closest('button, input, select');
    if (control && !control.hasAttribute('data-drag-handle')) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left,
      top,
    };
  };

  const onPointerMove = (event: PointerEvent) => {
    const { current } = drag;
    if (!current || current.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - current.startX;
    const deltaY = event.clientY - current.startY;
    if (!wasDragged.current) {
      if (Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) return;
      wasDragged.current = true;
      setDragging(true);
    }
    moveTo(current.left + deltaX, current.top + deltaY);
  };

  const onPointerEnd = (event: PointerEvent) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
  };

  // On the window, so a fast drag keeps going when the pointer leaves the card,
  // and before the whiteboard, which would draw under it
  useEffect(() => {
    const options = { capture: true };
    window.addEventListener('pointermove', onPointerMove, options);
    window.addEventListener('pointerup', onPointerEnd, options);
    window.addEventListener('pointercancel', onPointerEnd, options);
    return () => {
      window.removeEventListener('pointermove', onPointerMove, options);
      window.removeEventListener('pointerup', onPointerEnd, options);
      window.removeEventListener('pointercancel', onPointerEnd, options);
    };
  });

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-KEYBOARD_STEP, 0],
      ArrowRight: [KEYBOARD_STEP, 0],
      ArrowUp: [0, -KEYBOARD_STEP],
      ArrowDown: [0, KEYBOARD_STEP],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    // Keeps the arrow keys from also changing the slide
    event.stopPropagation();
    moveTo(left + move[0], top + move[1]);
  };

  return {
    ref,
    left,
    top,
    dragging,
    wasDragged,
    onKeyDown,
    onPointerDown,
  };
};

export default useFloatingPosition;
