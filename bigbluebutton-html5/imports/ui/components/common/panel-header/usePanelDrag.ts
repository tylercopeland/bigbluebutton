import React, { useEffect, useRef, useState } from 'react';
import KEYS from '/imports/utils/keys';
import usePanelSide from '/imports/ui/components/sidebar-content/usePanelSide';

const DRAG_THRESHOLD = 10;

type Side = 'left' | 'right';

// Lets the header of a side panel be dragged to move the panel to the other side
const usePanelDrag = () => {
  const { canMove, isPanelOnRight, togglePanelSide } = usePanelSide();
  const start = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [target, setTarget] = useState<Side | null>(null);
  const currentSide: Side = isPanelOnRight ? 'right' : 'left';

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;
    // Tabs fill most of the header, so they can be dragged too. Other controls can't.
    const control = (event.target as HTMLElement).closest('button, input, a, [role=button]');
    if (control && control.getAttribute('role') !== 'tab') return;
    start.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    setIsPressed(true);
  };

  useEffect(() => {
    if (!isPressed) return undefined;
    let side: Side | null = null;

    const stop = () => {
      start.current = null;
      setIsPressed(false);
      setTarget(null);
    };

    // A drag that starts on a tab must not also select it
    const ignoreNextClick = () => {
      const ignore = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
      };
      window.addEventListener('click', ignore, { capture: true, once: true });
      setTimeout(() => window.removeEventListener('click', ignore, { capture: true }), 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== start.current?.pointerId) return;
      const distance = Math.hypot(
        event.clientX - start.current.x,
        event.clientY - start.current.y,
      );
      if (!side && distance < DRAG_THRESHOLD) return;
      side = event.clientX > window.innerWidth / 2 ? 'right' : 'left';
      setTarget(side);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== start.current?.pointerId) return;
      if (side) ignoreNextClick();
      if (side && side !== currentSide) togglePanelSide();
      stop();
    };

    const onPointerCancel = (event: PointerEvent) => {
      if (event.pointerId === start.current?.pointerId) stop();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== KEYS.ESCAPE || !side) return;
      event.preventDefault();
      event.stopPropagation();
      stop();
    };

    window.addEventListener('pointermove', onPointerMove, true);
    window.addEventListener('pointerup', onPointerUp, true);
    window.addEventListener('pointercancel', onPointerCancel, true);
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('blur', stop);
    return () => {
      window.removeEventListener('pointermove', onPointerMove, true);
      window.removeEventListener('pointerup', onPointerUp, true);
      window.removeEventListener('pointercancel', onPointerCancel, true);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('blur', stop);
    };
  }, [isPressed, currentSide, togglePanelSide]);

  return {
    onPointerDown: canMove ? onPointerDown : undefined,
    canMove,
    target,
    isNewSide: target !== null && target !== currentSide,
  };
};

export default usePanelDrag;
