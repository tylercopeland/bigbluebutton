import { layoutSelectInput } from '/imports/ui/components/layout/context';
import { Input } from '/imports/ui/components/layout/layoutTypes';
import { PANELS } from '/imports/ui/components/layout/enums';
import { useIsChatEnabled } from '/imports/ui/services/features';
import usePanelStack from '/imports/ui/components/sidebar-content/stack/usePanelStack';
import useIsNavigationDocked from '/imports/ui/components/sidebar-navigation/hooks/useIsNavigationDocked';

// The tabs switch the main panel, so they are not shown while a second panel is open.
const useShowPeopleChatTabs = (panelId: string): boolean => {
  const isDocked = useIsNavigationDocked();
  const isChatEnabled = useIsChatEnabled();
  const isAuxiliaryOpen = layoutSelectInput((i: Input) => i.sidebarContentAuxiliary.isOpen);

  const { isDetached } = usePanelStack();

  return isDocked
    && !isDetached
    && isChatEnabled
    && !isAuxiliaryOpen
    && (panelId === PANELS.USERLIST || panelId === PANELS.CHAT);
};

export default useShowPeopleChatTabs;
