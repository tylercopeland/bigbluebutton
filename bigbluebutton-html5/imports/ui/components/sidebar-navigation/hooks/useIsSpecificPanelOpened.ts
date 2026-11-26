import { layoutSelectInput } from '/imports/ui/components/layout/context';
import usePanelStack from '/imports/ui/components/sidebar-content/stack/usePanelStack';
import { Input } from '/imports/ui/components/layout/layoutTypes';

// Selects the boolean directly (instead of the whole sidebarContent/
// sidebarContentAuxiliary object useIsPanelOpened reads) so
// use-context-selector's reference-equality check only re-renders this
// component when ITS OWN panel's open state flips, not on every sidebar
// panel toggle. Only use this for a fixed, statically-known panelId - for a
// dynamic/variable-length set of ids (e.g. looping over pinned apps), use
// useIsPanelOpened instead, since a parameterized hook can't be called a
// variable number of times per render.
const useIsSpecificPanelOpened = (panelId: string) => {
  // Stacked panels are open together, but only one is the current panel
  const { isStacked, panels } = usePanelStack();
  const isCurrent = layoutSelectInput((i: Input) => (
    (i.sidebarContent.isOpen === true && i.sidebarContent.sidebarContentPanel === panelId)
    || (i.sidebarContentAuxiliary.isOpen === true && i.sidebarContentAuxiliary.sidebarContentPanel === panelId)
  ));

  return isCurrent || (isStacked && panels.includes(panelId));
};

export default useIsSpecificPanelOpened;
