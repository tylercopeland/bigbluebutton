import { useEffect, useRef, useState } from 'react';
import { layoutDispatch, layoutSelect, layoutSelectInput } from '/imports/ui/components/layout/context';
import { Input, Layout } from '/imports/ui/components/layout/layoutTypes';
import { ACTIONS, PANELS } from '/imports/ui/components/layout/enums';
import { useStorageKey } from '/imports/ui/services/storage/hooks';
import usePanelSections, { isPanelTool, readSections } from './usePanelSections';
import * as model from './model';

// The client opens People or Chat once the layout is ready. The panel starts
// from what is stored instead, so those first opens are let through and then
// replaced.
const SETTLE_DELAY = 1500;

/**
 * Keeps the client's single "open panel" in step with the sections. The tool
 * used last is the open panel, so the rest of the client keeps working. Panels
 * opened from elsewhere (a poll, a private chat, a plugin) join the sections,
 * and a panel closed from elsewhere leaves only that tool.
 */
const PanelSectionsSync = () => {
  const layoutContextDispatch = layoutDispatch();
  const sections = usePanelSections();
  const { isDocked, focus, isVisible } = sections;
  const isOpen = layoutSelectInput((i: Input) => i.sidebarContent.isOpen) === true;
  const panel = layoutSelectInput((i: Input) => i.sidebarContent.sidebarContentPanel);
  const idChatOpen = layoutSelect((i: Layout) => i.idChatOpen);
  const [isSettled, setIsSettled] = useState(false);
  const lastFocus = useRef<string | null>(null);
  const layoutReady = useStorageKey('layoutReady') === true;

  useEffect(() => {
    if (!isDocked || !layoutReady || isSettled) return undefined;
    const timeout = setTimeout(() => setIsSettled(true), SETTLE_DELAY);
    return () => clearTimeout(timeout);
  }, [isDocked, layoutReady, isSettled]);

  const isActive = isDocked && isSettled;

  // Turns on the docked layout's styles, such as the stage animation
  useEffect(() => {
    document.documentElement.classList.toggle('bbb-docked', isDocked);
    return () => document.documentElement.classList.remove('bbb-docked');
  }, [isDocked]);
  const desiredPanel = isVisible && focus ? focus : PANELS.NONE;

  // Sections to layout
  useEffect(() => {
    if (!isActive) return;
    lastFocus.current = desiredPanel === PANELS.NONE ? lastFocus.current : desiredPanel;
    if (desiredPanel === PANELS.CHAT && !idChatOpen) {
      layoutContextDispatch({
        type: ACTIONS.SET_ID_CHAT_OPEN,
        value: window.meetingClientSettings.public.chat.public_group_id,
      });
    }
    const shouldBeOpen = desiredPanel !== PANELS.NONE;
    if (panel !== desiredPanel) {
      layoutContextDispatch({ type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL, value: desiredPanel });
    }
    if (isOpen !== shouldBeOpen) {
      layoutContextDispatch({ type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN, value: shouldBeOpen });
    }
  }, [isActive, desiredPanel]);

  // Layout to sections, for changes made elsewhere in the client. Skipped as
  // the sync starts: the layout still shows the client's own first panel,
  // which the sections are about to replace.
  const wasActive = useRef(false);
  useEffect(() => {
    const isStarting = isActive && !wasActive.current;
    wasActive.current = isActive;
    if (!isActive || isStarting) return;
    const current = readSections();
    const expected = model.isVisible(current) && current.focus ? current.focus : PANELS.NONE;
    const actual = isOpen ? panel : PANELS.NONE;
    if (actual === expected) return;

    if (isPanelTool(actual)) {
      sections.openTool(actual);
    } else if (expected !== PANELS.NONE) {
      // Closed from elsewhere, such as Polling when the presenter role moves:
      // only that tool goes, and the rest of the panel stays as it was
      sections.closeTool(expected);
    }
  }, [isActive, isOpen, panel]);

  return null;
};

export default PanelSectionsSync;
