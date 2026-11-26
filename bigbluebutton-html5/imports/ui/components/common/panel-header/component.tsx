import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Styled from '/imports/ui/components/sidebar-content/styles';
import MultifunctionalModeButton from '../multifunctional-mode-button/component';
import PeopleChatTabs from './people-chat-tabs/component';
import useShowPeopleChatTabs from './people-chat-tabs/useShowPeopleChatTabs';
import useIsNavigationDocked from '/imports/ui/components/sidebar-navigation/hooks/useIsNavigationDocked';
import usePanelDrag from './usePanelDrag';
import DragOverlay from './drag-overlay/component';
import StackTitle, { ColumnGrip } from './stack-title/component';
import usePanelStack, { STACKABLE_PANELS } from '/imports/ui/components/sidebar-content/stack/usePanelStack';
import usePanelClose from './usePanelClose';
import { Layout } from '/imports/ui/components/layout/layoutTypes';
import { layoutSelect } from '/imports/ui/components/layout/context';

const intlMessages = defineMessages({
  minimize: {
    id: 'app.sidebarContent.minimizePanelLabel',
    description: 'Generic minimize label for panels',
  },
});

interface PanelHeaderProps {
  /** PANELS enum value for this panel (e.g. PANELS.USERLIST) */
  panelId: string;
  /** Panel title displayed in the header */
  title: string;
  /** data-test attribute forwarded to the header element */
  dataTest?: string;
  /** Accessible label and visible label for the close/minimize button */
  closeButtonLabel?: string;
  /** data-test for the close button */
  closeButtonDataTest?: string;
  /** Extra props forwarded to the close button (e.g. accessKey) */
  closeButtonProps?: Record<string, unknown>;
  /**
   * Called before the layout dispatches the panel-close actions.
   * Use this for panel-specific cleanup (e.g. marking a private chat as hidden).
   * Receives whether the panel is currently rendered in the auxiliary panel.
   */
  onBeforeClose?: (isInAuxiliaryPanel: boolean) => void;
  /**
   * Extra buttons rendered to the right of the MultifunctionalModeButton.
   * The MultifunctionalModeButton is always included automatically.
   */
  customRightButton?: React.ReactElement | null;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  panelId,
  title,
  dataTest,
  closeButtonLabel,
  closeButtonDataTest,
  closeButtonProps = {},
  onBeforeClose,
  customRightButton,
}) => {
  const intl = useIntl();
  const { onPointerDown, canMove, drag } = usePanelDrag();
  const { isDetached, isStacked, panels } = usePanelStack();
  const { closePanel } = usePanelClose(panelId, onBeforeClose);
  const showTabs = useShowPeopleChatTabs(panelId);
  const isDocked = useIsNavigationDocked();
  const isRTL = layoutSelect((i: Layout) => i.isRTL);

  const resolvedCloseLabel = closeButtonLabel
    ?? intl.formatMessage(intlMessages.minimize, { panelName: title });

  const multifunctionalModeButton = <MultifunctionalModeButton panelId={panelId} />;
  const rightButton = customRightButton !== undefined
    ? (
      <>
        {multifunctionalModeButton}
        {customRightButton}
      </>
    ) : multifunctionalModeButton;

  // Tabs and stacked titles have drags of their own, so the column needs a grip
  const isStackable = STACKABLE_PANELS.includes(panelId);
  const isDetachedPanel = isDetached && isStackable;
  const showGrip = canMove && isStackable
    && (showTabs || (isStacked && panels[0] === panelId));
  let customTitle;
  if (showTabs || isDetachedPanel) {
    customTitle = (
      <>
        {showGrip && <ColumnGrip />}
        {isDetachedPanel ? <StackTitle panelId={panelId} /> : <PeopleChatTabs panelId={panelId} />}
      </>
    );
  }

  return (
    <>
      <Styled.HeaderContainer
        onPointerDown={onPointerDown}
        $isDraggable={canMove}
        isRTL={isRTL}
        data-test={dataTest}
        title={title}
        isPlain={isDocked}
        customTitle={customTitle}
        rightButtonProps={{
          'aria-label': resolvedCloseLabel,
          'data-test': closeButtonDataTest,
          icon: showTabs || isDocked ? 'close' : 'minus',
          label: resolvedCloseLabel,
          onClick: closePanel,
          ...closeButtonProps,
        }}
        customRightButton={rightButton}
      />
      {drag && <DragOverlay drag={drag} />}
    </>
  );
};

export default PanelHeader;
