import { useCallback, useMemo } from 'react';
import Storage from '/imports/ui/services/storage/local';
import { useStorageKey } from '/imports/ui/services/storage/hooks';
import {
  layoutDispatch,
  layoutSelect,
  layoutSelectInput,
  layoutSelectOutput,
} from '/imports/ui/components/layout/context';
import { Input, Layout, Output } from '/imports/ui/components/layout/layoutTypes';
import { ACTIONS, PANELS } from '/imports/ui/components/layout/enums';
import { useIsChatEnabled } from '/imports/ui/services/features';
import useIsNavigationDocked from '/imports/ui/components/sidebar-navigation/hooks/useIsNavigationDocked';

// Panels that share the segmented control, and can be detached from it
export const STACKABLE_PANELS: string[] = [PANELS.USERLIST, PANELS.CHAT];
export const MIN_STACKED_HEIGHT = 240;
const DEFAULT_RATIO = 0.5;

const ARRANGEMENT_KEY = 'panelArrangement';
const VISIBLE_KEY = 'panelStackVisible';

interface PanelColumn {
  /** Panel ids, from top to bottom */
  panels: string[];
  /** Share of the height that the first panel takes, from 0 to 1 */
  ratio: number;
}

// A list of columns, so that more than one can be supported later
interface PanelArrangement {
  columns: PanelColumn[];
}

const save = (key: string, value: object) => {
  try {
    Storage.setItem(key, value as never);
  } catch (error) {
    // The browser may block or be out of storage, the panels stay as they are
  }
};

const isStackable = (panel: unknown): panel is string => (
  typeof panel === 'string' && STACKABLE_PANELS.includes(panel)
);

// What is stored can't be trusted to have the expected shape
const readColumn = (stored: unknown): PanelColumn | null => {
  const column = (stored as PanelArrangement | null)?.columns?.[0];
  if (!column || !Array.isArray(column.panels)) return null;
  const { panels, ratio } = column;
  if (panels.length !== 2 || panels[0] === panels[1] || !panels.every(isStackable)) return null;
  return {
    panels,
    ratio: typeof ratio === 'number' && ratio > 0 && ratio < 1 ? ratio : DEFAULT_RATIO,
  };
};

const saveColumn = (panels: string[], ratio: number) => {
  const arrangement: PanelArrangement = { columns: [{ panels, ratio }] };
  save(ARRANGEMENT_KEY, arrangement);
};

export const setVisibleStackPanels = (panels: string[]) => save(VISIBLE_KEY, panels);

/**
 * People and Chat start connected by the segmented control. One can be detached,
 * which stacks them in the same column. Other panels cover the stack.
 */
const usePanelStack = () => {
  const layoutContextDispatch = layoutDispatch();
  const isDocked = useIsNavigationDocked();
  const isChatEnabled = useIsChatEnabled();
  const idChatOpen = layoutSelect((i: Layout) => i.idChatOpen);
  const isOpen = layoutSelectInput((i: Input) => i.sidebarContent.isOpen) === true;
  const currentPanel = layoutSelectInput((i: Input) => i.sidebarContent.sidebarContentPanel);
  const isAuxiliaryOpen = layoutSelectInput((i: Input) => i.sidebarContentAuxiliary.isOpen) === true;
  const height = layoutSelectOutput((i: Output) => i.sidebarContent.height) || 0;
  const storedArrangement = useStorageKey(ARRANGEMENT_KEY, 'local');
  const storedVisible = useStorageKey(VISIBLE_KEY, 'local');

  const column = useMemo(() => readColumn(storedArrangement), [storedArrangement]);
  const canStack = isDocked && !!isChatEnabled && !isAuxiliaryOpen;
  // There is no height to measure while the column is closed
  const fits = height === 0 || height >= MIN_STACKED_HEIGHT * 2;
  const isDetached = canStack && fits && column !== null;
  const isStackPanel = isStackable(currentPanel);

  const visiblePanels = useMemo(() => {
    if (!column) return [];
    const stored = Array.isArray(storedVisible) ? (storedVisible as unknown[]) : column.panels;
    return column.panels.filter((panel) => (
      stored.includes(panel) || (isOpen && panel === currentPanel)
    ));
  }, [column, storedVisible, isOpen, currentPanel]);

  const isStacked = isDetached && isOpen && isStackPanel && visiblePanels.length === 2;

  const openChatIfNeeded = useCallback(() => {
    if (idChatOpen) return;
    layoutContextDispatch({
      type: ACTIONS.SET_ID_CHAT_OPEN,
      value: window.meetingClientSettings.public.chat.public_group_id,
    });
  }, [idChatOpen, layoutContextDispatch]);

  /** Shows the panel below the other one */
  const detach = useCallback((panel: string) => {
    const other = STACKABLE_PANELS.find((id) => id !== panel);
    if (!other) return;
    saveColumn([other, panel], DEFAULT_RATIO);
    setVisibleStackPanels([other, panel]);
    openChatIfNeeded();
    if (!isStackPanel) {
      layoutContextDispatch({ type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL, value: other });
    }
  }, [openChatIfNeeded, isStackPanel, layoutContextDispatch]);

  /** Connects the panels back to the segmented control */
  const combine = useCallback((panelToShow?: string) => {
    save(ARRANGEMENT_KEY, { columns: [] });
    if (panelToShow) {
      layoutContextDispatch({ type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL, value: panelToShow });
    }
  }, [layoutContextDispatch]);

  const setRatio = useCallback((ratio: number) => {
    if (column) saveColumn(column.panels, ratio);
  }, [column]);

  const resetRatio = useCallback(() => setRatio(DEFAULT_RATIO), [setRatio]);

  /**
   * Call when a panel closes.
   * @returns The panel that takes its place, or null to close the column
   */
  const closeInStack = useCallback((panel: string): string | null => {
    if (!isDetached || !isOpen) return null;
    if (!isStackable(panel)) return visiblePanels[0] ?? null;
    const remaining = visiblePanels.filter((id) => id !== panel);
    setVisibleStackPanels(remaining);
    return remaining[0] ?? null;
  }, [isDetached, isOpen, visiblePanels]);

  return {
    canStack,
    fits,
    isOpen,
    isDetached,
    isStacked,
    currentPanel,
    panels: column?.panels ?? [],
    ratio: column?.ratio ?? DEFAULT_RATIO,
    visiblePanels,
    detach,
    combine,
    setRatio,
    resetRatio,
    closeInStack,
  };
};

export default usePanelStack;
