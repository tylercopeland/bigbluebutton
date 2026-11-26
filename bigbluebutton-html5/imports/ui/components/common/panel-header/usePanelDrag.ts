import React, { useEffect, useRef, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import KEYS from '/imports/utils/keys';
import { layoutSelectOutput } from '/imports/ui/components/layout/context';
import { Output } from '/imports/ui/components/layout/layoutTypes';
import { SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH } from '/imports/ui/components/layout/defaultValues';
import usePanelSide from '/imports/ui/components/sidebar-content/usePanelSide';
import usePanelStack from '/imports/ui/components/sidebar-content/stack/usePanelStack';

const DRAG_THRESHOLD = 10;

const intlMessages = defineMessages({
  moveColumn: {
    id: 'app.sidebarContent.dropHere',
    description: 'Shown where the panel goes when it is dropped',
    defaultMessage: 'Move panel here',
  },
  detach: {
    id: 'app.sidebarContent.dropBelow',
    description: 'Shown where a tab goes when it is dropped below the visible panel',
    defaultMessage: 'Show {name} below',
  },
  combine: {
    id: 'app.sidebarContent.dropCombine',
    description: 'Shown where a stacked panel can be dropped to connect both as tabs',
    defaultMessage: 'Combine into tabs',
  },
});

// column: moves everything to the other side of the window
// detach: takes a tab out of the segmented control, below the visible panel
// combine: connects stacked panels back to the segmented control
type DragKind = 'column' | 'detach' | 'combine';

export interface PanelDrag {
  kind: DragKind;
  x: number;
  y: number;
  /** Where the panel goes, in the window. Null if it can't be dropped. */
  area: { left: number; top: number; width: number; height: number } | null;
  /** Whether dropping now has an effect */
  isActive: boolean;
  label: string;
  /** Text that follows the pointer */
  ghost: string | null;
}

interface DragStart {
  kind: DragKind;
  pointerId: number;
  x: number;
  y: number;
  panel: string;
  name: string;
}

const isInside = (x: number, y: number, area: PanelDrag['area']) => !!area
  && x >= area.left && x <= area.left + area.width
  && y >= area.top && y <= area.top + area.height;

const toArea = (element: Element | null): PanelDrag['area'] => {
  const rect = element?.getBoundingClientRect();
  return rect ? {
    left: rect.left, top: rect.top, width: rect.width, height: rect.height,
  } : null;
};

const usePanelDrag = () => {
  const intl = useIntl();
  const { canMove, isPanelOnRight, togglePanelSide } = usePanelSide();
  const stack = usePanelStack();
  const panelOutput = layoutSelectOutput((i: Output) => i.sidebarContent);
  const start = useRef<DragStart | null>(null);
  const dragRef = useRef<PanelDrag | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [drag, setDrag] = useState<PanelDrag | null>(null);

  const getKind = (target: HTMLElement): Partial<DragStart> | null => {
    const tab = target.closest<HTMLElement>('[role=tab][data-panel]');
    if (tab) {
      return stack.canStack
        ? { kind: 'detach', panel: tab.dataset.panel, name: tab.dataset.name }
        : null;
    }
    if (target.closest('button, input, a, [role=button]')) return null;
    const title = target.closest<HTMLElement>('[data-stack-title]');
    if (title && stack.isStacked) {
      return { kind: 'combine', panel: title.dataset.stackTitle, name: title.textContent ?? '' };
    }
    return { kind: 'column', panel: '', name: '' };
  };

  const getDrag = (current: DragStart, x: number, y: number): PanelDrag => {
    const base = { kind: current.kind, x, y };

    if (current.kind === 'column') {
      const isRight = x > window.innerWidth / 2;
      const width = panelOutput.width
        - window.innerWidth * SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH;
      return {
        ...base,
        area: {
          left: isRight ? window.innerWidth - width : 0,
          top: 0,
          width,
          height: window.innerHeight,
        },
        isActive: isRight !== isPanelOnRight,
        label: intl.formatMessage(intlMessages.moveColumn),
        ghost: null,
      };
    }

    if (current.kind === 'detach') {
      const panel = toArea(document.querySelector('.bbb-sidebar-content__panel'));
      const area = panel && stack.fits ? {
        ...panel,
        top: panel.top + panel.height / 2,
        height: panel.height / 2,
      } : null;
      return {
        ...base,
        area,
        isActive: isInside(x, y, area),
        label: intl.formatMessage(intlMessages.detach, { name: current.name }),
        ghost: current.name,
      };
    }

    const other = stack.panels.find((id) => id !== current.panel);
    const area = toArea(document.querySelector(`[data-stack-panel="${other}"]`));
    return {
      ...base,
      area,
      isActive: isInside(x, y, area),
      label: intl.formatMessage(intlMessages.combine),
      ghost: current.name,
    };
  };

  const drop = (current: DragStart) => {
    if (current.kind === 'column') togglePanelSide();
    if (current.kind === 'detach') stack.detach(current.panel);
    if (current.kind === 'combine') {
      stack.combine(stack.panels.find((id) => id !== current.panel));
    }
  };

  // The listeners live as long as the press, and need what is current
  const latest = useRef({ getDrag, drop });
  latest.current = { getDrag, drop };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;
    const kind = getKind(event.target as HTMLElement);
    if (!kind) return;
    start.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      ...kind,
    } as DragStart;
    setIsPressed(true);
  };

  useEffect(() => {
    if (!isPressed) return undefined;

    const update = (value: PanelDrag | null) => {
      dragRef.current = value;
      setDrag(value);
    };

    const stop = () => {
      start.current = null;
      setIsPressed(false);
      update(null);
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
      const { current } = start;
      if (event.pointerId !== current?.pointerId) return;
      const distance = Math.hypot(event.clientX - current.x, event.clientY - current.y);
      if (!dragRef.current && distance < DRAG_THRESHOLD) return;
      update(latest.current.getDrag(current, event.clientX, event.clientY));
    };

    const onPointerUp = (event: PointerEvent) => {
      const { current } = start;
      if (event.pointerId !== current?.pointerId) return;
      if (dragRef.current) ignoreNextClick();
      if (dragRef.current?.isActive) latest.current.drop(current);
      stop();
    };

    const onPointerCancel = (event: PointerEvent) => {
      if (event.pointerId === start.current?.pointerId) stop();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== KEYS.ESCAPE || !dragRef.current) return;
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
  }, [isPressed]);

  return {
    onPointerDown: canMove ? onPointerDown : undefined,
    canMove,
    drag,
  };
};

export default usePanelDrag;
