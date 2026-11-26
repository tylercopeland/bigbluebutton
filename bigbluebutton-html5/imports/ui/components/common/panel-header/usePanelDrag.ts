import React, { useEffect, useRef, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import KEYS from '/imports/utils/keys';
import { layoutSelectOutput } from '/imports/ui/components/layout/context';
import { Output } from '/imports/ui/components/layout/layoutTypes';
import { SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH } from '/imports/ui/components/layout/defaultValues';
import usePanelSide from '/imports/ui/components/sidebar-content/usePanelSide';
import usePanelSections from '/imports/ui/components/sidebar-content/sections/usePanelSections';
import useToolName from '/imports/ui/components/sidebar-content/sections/useToolName';
import useMovePanelSide from './useMovePanelSide';

/** A shorter press is a click, which selects a tab */
const DRAG_THRESHOLD = 6;
const SOURCE_OPACITY = '0.35';

const intlMessages = defineMessages({
  moveRight: {
    id: 'app.sidebarContent.drop.moveRight',
    description: 'Shown where the panel goes when it is dropped on the right',
    defaultMessage: 'Drop to move the panel to the right',
  },
  moveLeft: {
    id: 'app.sidebarContent.drop.moveLeft',
    description: 'Shown where the panel goes when it is dropped on the left',
    defaultMessage: 'Drop to move the panel to the left',
  },
  stackBelow: {
    id: 'app.sidebarContent.drop.stackBelow',
    description: 'Shown where a tab goes when it is dropped below the panel',
    defaultMessage: 'Drop to stack {name} below',
  },
  addAsTab: {
    id: 'app.sidebarContent.drop.addAsTab',
    description: 'Shown on a section that a tool can join as a tab',
    defaultMessage: 'Drop to add {name} as a tab next to {other}',
  },
});

// column: moves the whole panel to the other side of the window
// tab: a tab, which stacks below or joins the other section
// title: a section's plain title, which joins the other section
type DragKind = 'column' | 'tab' | 'title';
type DropAction = 'moveSide' | 'moveBelow' | 'combine';

interface Area { left: number; top: number; width: number; height: number }

export interface PanelDrag {
  kind: DragKind;
  x: number;
  y: number;
  /** Where the item goes, in the window. Null if it can't be dropped anywhere. */
  area: Area | null;
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
  tool: string;
  source: HTMLElement | null;
}

const isInside = (x: number, y: number, area: Area | null) => !!area
  && x >= area.left && x <= area.left + area.width
  && y >= area.top && y <= area.top + area.height;

const toArea = (element: Element | null): Area | null => {
  const rect = element?.getBoundingClientRect();
  return rect ? {
    left: rect.left, top: rect.top, width: rect.width, height: rect.height,
  } : null;
};

/**
 * One drag system for the panel: press a header to move the panel to the other
 * side, a tab to stack it below or add it to the other section, or a section's
 * title to add it to the other section.
 */
const usePanelDrag = () => {
  const intl = useIntl();
  const toolName = useToolName();
  const { canMove, isPanelOnRight } = usePanelSide();
  const movePanelSide = useMovePanelSide();
  const sections = usePanelSections();
  const panelOutput = layoutSelectOutput((i: Output) => i.sidebarContent);
  const start = useRef<DragStart | null>(null);
  const dragRef = useRef<{ drag: PanelDrag; action: DropAction | null } | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [drag, setDrag] = useState<PanelDrag | null>(null);

  const getStart = (target: HTMLElement): Omit<DragStart, 'pointerId' | 'x' | 'y'> | null => {
    const tab = target.closest<HTMLElement>('[role=tab][data-panel]');
    if (tab) return { kind: 'tab', tool: tab.dataset.panel ?? '', source: tab };
    const title = target.closest<HTMLElement>('[data-section-title]');
    if (title && sections.getCombineTarget(title.dataset.sectionTitle ?? '') !== -1) {
      return { kind: 'title', tool: title.dataset.sectionTitle ?? '', source: title };
    }
    // The grip opens a menu when clicked, and moves the panel when dragged
    if (target.closest('[data-column-grip]')) return { kind: 'column', tool: '', source: null };
    if (target.closest('button, input, a, [role=button]')) return null;
    return { kind: 'column', tool: '', source: null };
  };

  const getDrag = (current: DragStart, x: number, y: number) => {
    const base = { kind: current.kind, x, y };
    const name = current.tool ? toolName(current.tool) : '';

    if (current.kind === 'column') {
      const isRight = x > window.innerWidth / 2;
      const width = panelOutput.width
        - window.innerWidth * SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH;
      const isActive = isRight !== isPanelOnRight;
      return {
        action: isActive ? 'moveSide' as const : null,
        drag: {
          ...base,
          area: {
            left: isRight ? window.innerWidth - width : 0, top: 0, width, height: window.innerHeight,
          },
          isActive,
          label: intl.formatMessage(isRight ? intlMessages.moveRight : intlMessages.moveLeft),
          ghost: null,
        },
      };
    }

    if (current.kind === 'tab' && sections.canMoveBelow(current.tool)) {
      const panel = toArea(document.querySelector('.bbb-sidebar-content__panel'));
      const area = panel && {
        ...panel, top: panel.top + panel.height / 2, height: panel.height / 2,
      };
      const isActive = isInside(x, y, area);
      return {
        action: isActive ? 'moveBelow' as const : null,
        drag: {
          ...base,
          area,
          isActive,
          label: intl.formatMessage(intlMessages.stackBelow, { name }),
          ghost: name,
        },
      };
    }

    const targetIndex = sections.getCombineTarget(current.tool);
    const target = sections.sections[targetIndex];
    const area = target
      ? toArea(document.querySelector(`[data-panel-section="${targetIndex}"]`))
      : null;
    const isActive = isInside(x, y, area);
    return {
      action: isActive ? 'combine' as const : null,
      drag: {
        ...base,
        area,
        isActive,
        label: target
          ? intl.formatMessage(intlMessages.addAsTab, { name, other: toolName(target.active) })
          : '',
        ghost: name,
      },
    };
  };

  const drop = (current: DragStart, action: DropAction | null) => {
    if (action === 'moveSide') movePanelSide();
    if (action === 'moveBelow') sections.moveBelow(current.tool);
    if (action === 'combine') sections.combine(current.tool);
  };

  // The listeners live as long as the press, and need what is current
  const latest = useRef({ getDrag, drop });
  latest.current = { getDrag, drop };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;
    const kind = getStart(event.target as HTMLElement);
    if (!kind) return;
    start.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      ...kind,
    };
    setIsPressed(true);
  };

  useEffect(() => {
    if (!isPressed) return undefined;

    const update = (value: { drag: PanelDrag; action: DropAction | null } | null) => {
      dragRef.current = value;
      setDrag(value?.drag ?? null);
    };

    const stop = () => {
      if (start.current?.source) start.current.source.style.opacity = '';
      start.current = null;
      setIsPressed(false);
      update(null);
    };

    // A drag that starts on a tab or the grip must not also click it
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
      if (!dragRef.current && current.source) current.source.style.opacity = SOURCE_OPACITY;
      update(latest.current.getDrag(current, event.clientX, event.clientY));
    };

    const onPointerUp = (event: PointerEvent) => {
      const { current } = start;
      if (event.pointerId !== current?.pointerId) return;
      if (dragRef.current) {
        ignoreNextClick();
        latest.current.drop(current, dragRef.current.action);
      }
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
