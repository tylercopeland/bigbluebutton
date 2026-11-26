import { useCallback } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import usePanelSide from '/imports/ui/components/sidebar-content/usePanelSide';
import { addAlert } from '/imports/ui/components/screenreader-alert/service';

const intlMessages = defineMessages({
  movedRight: {
    id: 'app.sidebarContent.announce.movedRight',
    description: 'Screen reader announcement when the panel moves to the right',
    defaultMessage: 'Panel moved to the right',
  },
  movedLeft: {
    id: 'app.sidebarContent.announce.movedLeft',
    description: 'Screen reader announcement when the panel moves to the left',
    defaultMessage: 'Panel moved to the left',
  },
});

/** Moves the panel to the other side of the window, and says so */
const useMovePanelSide = () => {
  const intl = useIntl();
  const { isPanelOnRight, togglePanelSide } = usePanelSide();

  return useCallback(() => {
    togglePanelSide();
    addAlert(intl.formatMessage(isPanelOnRight ? intlMessages.movedLeft : intlMessages.movedRight));
  }, [intl, isPanelOnRight, togglePanelSide]);
};

export default useMovePanelSide;
