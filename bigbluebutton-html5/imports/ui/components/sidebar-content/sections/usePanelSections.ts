import { useCallback, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Storage from '/imports/ui/services/storage/local';
import { useStorageKey } from '/imports/ui/services/storage/hooks';
import { layoutSelectInput, layoutSelectOutput } from '/imports/ui/components/layout/context';
import { Input, Output } from '/imports/ui/components/layout/layoutTypes';
import { PANELS } from '/imports/ui/components/layout/enums';
import useIsNavigationDocked from '/imports/ui/components/sidebar-navigation/hooks/useIsNavigationDocked';
import { addAlert } from '/imports/ui/components/screenreader-alert/service';
import * as model from './model';
import useToolName from './useToolName';

/** Smallest height a section can be given, so its header always shows */
export const MIN_SECTION_HEIGHT = 120;
/** Below this panel height, new tools join as tabs instead of stacking */
const MIN_STACK_HEIGHT = 400;

const STORAGE_KEY = 'panelSections';

// Tools with a place of their own: the gallery is a popover, the timer a card
const NOT_IN_PANEL: string[] = [PANELS.NONE, PANELS.APPS_GALLERY, PANELS.TIMER];
export const isPanelTool = (tool: string | undefined | null): tool is string => (
  typeof tool === 'string' && !!tool && !NOT_IN_PANEL.includes(tool)
);

export const readSections = () => model.parse(Storage.getItem(STORAGE_KEY), isPanelTool);

const save = (state: model.PanelSections) => {
  try {
    Storage.setItem(STORAGE_KEY, state as never);
  } catch (error) {
    // The browser may block or be out of storage; the panel keeps working this session
  }
};

const intlMessages = defineMessages({
  movedBelow: {
    id: 'app.sidebarContent.announce.movedBelow',
    description: 'Screen reader announcement when a tool is stacked below another',
    defaultMessage: '{name} moved below {other}',
  },
  combined: {
    id: 'app.sidebarContent.announce.combined',
    description: 'Screen reader announcement when a tool becomes a tab next to another',
    defaultMessage: '{name} added as a tab next to {other}',
  },
  minimized: {
    id: 'app.sidebarContent.announce.minimized',
    description: 'Screen reader announcement when a panel section is minimized',
    defaultMessage: '{name} minimized',
  },
  expanded: {
    id: 'app.sidebarContent.announce.expanded',
    description: 'Screen reader announcement when a minimized panel section is restored',
    defaultMessage: '{name} restored',
  },
  stacked: {
    id: 'app.sidebarContent.announce.stacked',
    description: 'Screen reader announcement when a tool opens below the others',
    defaultMessage: '{name} opened below {other}',
  },
});

/**
 * The side panel's sections and tabs, while the navigation is docked. Stored in
 * the browser, so the arrangement survives a reload.
 */
const usePanelSections = () => {
  const intl = useIntl();
  const toolName = useToolName();
  const isDocked = useIsNavigationDocked();
  const stored = useStorageKey(STORAGE_KEY, 'local');
  const isAuxiliaryOpen = layoutSelectInput((i: Input) => i.sidebarContentAuxiliary.isOpen) === true;
  const height = layoutSelectOutput((i: Output) => i.sidebarContent.height) || 0;

  const state = useMemo(() => model.parse(stored, isPanelTool), [stored]);
  // There is no height to measure while the panel is closed
  const fits = (height || window.innerHeight) >= MIN_STACK_HEIGHT;
  const canStack = isDocked && !isAuxiliaryOpen && fits;

  // Reads what is stored, so that several calls in a row build on each other
  const update = useCallback((change: (current: model.PanelSections) => model.PanelSections) => {
    const current = readSections();
    const next = change(current);
    if (next !== current) save(next);
    return { current, next };
  }, []);

  const announce = (message: string) => addAlert(message);
  const sectionName = (section?: model.PanelSection) => (section ? toolName(section.active) : '');

  const toggleTool = useCallback((tool: string) => {
    const { current, next } = update((s) => model.toggleTool(s, tool, canStack));
    const wasNewSection = next.sections.length > current.sections.length && current.sections.length > 0;
    if (wasNewSection) {
      announce(intl.formatMessage(intlMessages.stacked, {
        name: toolName(tool), other: sectionName(next.sections[0]),
      }));
    }
  }, [update, canStack, intl, toolName]);

  const openTool = useCallback((tool: string) => {
    update((s) => model.openTool(s, tool, canStack));
  }, [update, canStack]);

  const closeTool = useCallback((tool: string) => {
    update((s) => model.closeTool(s, tool));
  }, [update]);

  const moveBelow = useCallback((tool: string) => {
    const { current, next } = update((s) => model.moveBelow(s, tool, canStack));
    if (next === current) return;
    announce(intl.formatMessage(intlMessages.movedBelow, {
      name: toolName(tool), other: sectionName(next.sections[0]),
    }));
  }, [update, canStack, intl, toolName]);

  const combine = useCallback((tool: string) => {
    const before = readSections();
    const target = before.sections[model.getCombineTarget(before, tool)];
    const { current, next } = update((s) => model.combine(s, tool));
    if (next === current || !target) return;
    announce(intl.formatMessage(intlMessages.combined, {
      name: toolName(tool), other: toolName(target.active),
    }));
  }, [update, intl, toolName]);

  const minimize = useCallback((index: number) => {
    const { current, next } = update((s) => model.minimize(s, index));
    if (next === current) return;
    announce(intl.formatMessage(intlMessages.minimized, { name: sectionName(current.sections[index]) }));
  }, [update, intl, toolName]);

  const expand = useCallback((index: number) => {
    const { current, next } = update((s) => model.expand(s, index));
    if (next === current) return;
    announce(intl.formatMessage(intlMessages.expanded, { name: sectionName(current.sections[index]) }));
  }, [update, intl, toolName]);

  const setRatio = useCallback((ratio: number) => {
    update((s) => model.setRatio(s, ratio));
  }, [update]);

  const resetRatio = useCallback(() => setRatio(model.DEFAULT_RATIO), [setRatio]);

  return {
    ...state,
    isDocked,
    canStack,
    isVisible: model.isVisible(state),
    isStacked: state.sections.length > 1,
    findSection: (tool: string) => model.findSection(state, tool),
    isToolOpen: (tool: string) => model.isToolOpen(state, tool),
    isToolShowing: (tool: string) => model.isToolShowing(state, tool),
    canMoveBelow: (tool: string) => model.canMoveBelow(state, tool, canStack),
    getCombineTarget: (tool: string) => model.getCombineTarget(state, tool),
    toggleTool,
    openTool,
    closeTool,
    moveBelow,
    combine,
    minimize,
    expand,
    setRatio,
    resetRatio,
  };
};

export default usePanelSections;
