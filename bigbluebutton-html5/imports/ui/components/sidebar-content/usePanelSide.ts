import { useCallback } from 'react';
import Storage from '/imports/ui/services/storage/local';
import { useStorageKey } from '/imports/ui/services/storage/hooks';
import { layoutSelect } from '/imports/ui/components/layout/context';
import { Layout } from '/imports/ui/components/layout/layoutTypes';
import useIsNavigationDocked from '/imports/ui/components/sidebar-navigation/hooks/useIsNavigationDocked';

const STORAGE_KEY = 'panelMoved';

// The side panel starts where the language does: on the left, or on the right
// for right-to-left languages. With the docked navigation it can be moved to the
// other side, which is remembered in this browser.
const usePanelSide = () => {
  const isRTL = layoutSelect((i: Layout) => i.isRTL);
  const canMove = useIsNavigationDocked();
  const wasMoved = useStorageKey(STORAGE_KEY, 'local') === true;
  const isMoved = canMove && wasMoved;

  const togglePanelSide = useCallback(() => {
    try {
      Storage.setItem(STORAGE_KEY, Storage.getItem(STORAGE_KEY) !== true);
    } catch (error) {
      // The browser may block or be out of storage, the panel stays where it is
    }
  }, []);

  return {
    canMove,
    isMoved,
    isPanelOnRight: isRTL !== isMoved,
    togglePanelSide,
  };
};

export default usePanelSide;
