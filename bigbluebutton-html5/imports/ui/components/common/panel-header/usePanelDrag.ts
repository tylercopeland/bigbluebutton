import React, { useEffect, useRef, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import KEYS from '/imports/utils/keys';
import { layoutSelectOutput } from '/imports/ui/components/layout/context';
import { Output } from '/imports/ui/components/layout/layoutTypes';
import {
  DOCKED_PANEL_MAX_PERCENTAGE_WIDTH,
  DOCKED_PANEL_WIDTH,
  DOCKED_STAGE_GAP,
} from '/imports/ui/components/layout/defaultValues';
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
  moveAside: {
    id: 'app.sidebarContent.drop.moveAside',
    description: 'Shown at the far edge of the window, where a tool opens in a panel of its own',
    defaultMessage: '{side, select, right {Drop to open {name} in a panel on the right} other {Drop to open {name} in a panel on the left}}',
  },
  moveBack: {
    id: 'app.sidebarContent.drop.moveBack',
    description: 'Shown where a docked tool goes back to the side panel',
    defaultMessage: 'Drop to move {name} back to the side panel',
  },
});

// column: moves the whole panel to the other side of the window
// tab: a tab, which stacks below, joins the other section or docks across the stage
// title: a section's plain title, or the docked panel's, which can go the same places
type DragKind = 'column' | 'tab' | 'title';
type DropAction = 'moveSide' | 'moveBelow' | 'combine' | 'moveAside' | 'moveBack';

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
    if (title) return { kind: 'title', tool: title.dataset.sectionTitle ?? '', source: title };
    const isGrip = !!target.closest('[data-column-grip]');
    if (!isGrip && target.closest('button, input, a, [role=button]')) return null;
    // The docked panel's whole header carries its tool
    const aside = target.closest<HTMLElement>('[data-aside-panel]');
    if (aside) {
      const source = aside.querySelector<HTMLElement>('[data-section-title]');
      return { kind: 'title', tool: aside.dataset.asidePanel ?? '', source };
    }
    // The grip opens a menu when clicked, and moves the panel when dragged
    return { kind: 'column', tool: '', source: null };
  };

  // The far edge of the window, where the docked panel is or would be
  const getAsideArea = (): Area => {
    const docked = toArea(document.querySelector('.bbb-aside-panel'));
    if (docked) return docked;
    const width = Math.min(DOCKED_PANEL_WIDTH, window.innerWidth * DOCKED_PANEL_MAX_PERCENTAGE_WIDTH);
    return {
      left: sections.isAsideOnRight ? window.innerWidth - width : 0,
      top: 0,
      width,
      height: window.innerHeight,
    };
  };

  // The side panel, or the edge it opens from while it is closed
  const getPanelArea = (): Area => {
    const panel = toArea(document.querySelector('.bbb-sidebar-content__panel'));
    if (panel) return panel;
    const width = Math.min(DOCKED_PANEL_WIDTH, window.innerWidth * DOCKED_PANEL_MAX_PERCENTAGE_WIDTH);
    return {
      left: isPanelOnRight ? window.innerWidth - width : 0, top: 0, width, height: window.innerHeight,
    };
  };

  const getDrag = (current: DragStart, x: number, y: number) => {
    const base = { kind: current.kind, x, y };
    const name = current.tool ? toolName(current.tool) : '';

    if (current.kind === 'column') {
      const isRight = x > window.innerWidth / 2;
      const width = panelOutput.width - DOCKED_STAGE_GAP;
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

    type Option = { action: DropAction; area: Area | null; label: string };
    const options: Option[] = [];
    const isFromAside = sections.isAside(current.tool);
    const side = sections.isAsideOnRight ? 'right' : 'left';

    if (sections.canMoveAside(current.tool)) {
      options.push({
        action: 'moveAside',
        area: getAsideArea(),
        label: intl.formatMessage(intlMessages.moveAside, { name, side }),
      });
    }

    if (sections.canMoveBelow(current.tool)) {
      const panel = toArea(document.querySelector('.bbb-sidebar-content__panel'));
      options.push({
        action: 'moveBelow',
        area: panel && {
          ...panel, top: panel.top + panel.height / 2, height: panel.height / 2,
        },
        label: intl.formatMessage(intlMessages.stackBelow, { name }),
      });
    }

    const targetIndex = sections.getCombineTarget(current.tool);
    const target = sections.sections[targetIndex];
    if (target) {
      options.push({
        action: 'combine',
        area: toArea(document.querySelector(`[data-panel-section="${targetIndex}"]`)),
        label: intl.formatMessage(intlMessages.addAsTab, {
          name, other: target.tabs.map(toolName).join(', '),
        }),
      });
    }

    if (isFromAside) {
      options.push({
        action: 'moveBack',
        area: getPanelArea(),
        label: intl.formatMessage(intlMessages.moveBack, { name }),
      });
    }

    // The first place under the pointer wins. Elsewhere, the likeliest place shows as a hint:
    // the side panel for a docked tool, otherwise the far edge.
    const hovered = options.find((option) => isInside(x, y, option.area));
    const hint = isFromAside ? options[options.length - 1] : options[0];
    const shown = hovered ?? hint;
    return {
      action: hovered?.action ?? null,
      drag: {
        ...base,
        area: shown?.area ?? null,
        isActive: !!hovered,
        label: shown?.label ?? '',
        ghost: name,
      },
    };
  };

  const drop = (current: DragStart, action: DropAction | null) => {
    if (action === 'moveSide') movePanelSide();
    if (action === 'moveBelow') sections.moveBelow(current.tool);
    if (action === 'combine') sections.combine(current.tool);
    if (action === 'moveAside') sections.moveAside(current.tool);
    if (action === 'moveBack') sections.moveBack();
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
