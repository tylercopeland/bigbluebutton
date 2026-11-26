import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Styled from '/imports/ui/components/sidebar-content/styles';
import MultifunctionalModeButton from '../multifunctional-mode-button/component';
import SectionTabs from './section-tabs/component';
import SectionTitle from './section-title/component';
import ArrangeMenu from './arrange-menu/component';
import useIsNavigationDocked from '/imports/ui/components/sidebar-navigation/hooks/useIsNavigationDocked';
import usePanelDrag from './usePanelDrag';
import DragOverlay from './drag-overlay/component';
import usePanelSections from '/imports/ui/components/sidebar-content/sections/usePanelSections';
import useToolName from '/imports/ui/components/sidebar-content/sections/useToolName';
import usePanelClose from './usePanelClose';
import { Layout } from '/imports/ui/components/layout/layoutTypes';
import { layoutSelect } from '/imports/ui/components/layout/context';

const intlMessages = defineMessages({
  minimize: {
    id: 'app.sidebarContent.minimizePanelLabel',
    description: 'Generic minimize label for panels',
  },
  minimizeSection: {
    id: 'app.sidebarContent.minimizeSection',
    description: 'Label for the button that minimizes a section of the side panel',
    defaultMessage: 'Minimize {name}',
  },
  and: {
    id: 'app.sidebarContent.minimizeSection.and',
    description: 'Joins the names of the tools in a section, as in "People and Chat"',
    defaultMessage: ' and ',
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
  /** Shown after the title in a section of its own, like the number of people */
  count?: number;
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
  count,
}) => {
  const intl = useIntl();
  const { onPointerDown, canMove, drag } = usePanelDrag();
  const sections = usePanelSections();
  const toolName = useToolName();
  const { closePanel } = usePanelClose(panelId, onBeforeClose);
  const isDocked = useIsNavigationDocked();
  const isRTL = layoutSelect((i: Layout) => i.isRTL);
  const [menuTool, setMenuTool] = useState<string | null>(null);

  const sectionIndex = sections.findSection(panelId);
  const section = sections.sections[sectionIndex];
  const isAside = isDocked && sections.isAside(panelId);
  const isInSection = isDocked && (!!section || isAside);
  const tabs = section?.tabs ?? [panelId];

  // Minimizing closes the section, with every tool in it
  const resolvedCloseLabel = isInSection
    ? intl.formatMessage(intlMessages.minimizeSection, {
      name: tabs.map(toolName).join(intl.formatMessage(intlMessages.and)),
    })
    : closeButtonLabel ?? intl.formatMessage(intlMessages.minimize, { panelName: title });
  const minimizeSection = () => (isAside ? sections.closeAside() : sections.closeSection(sectionIndex));

  const multifunctionalModeButton = <MultifunctionalModeButton panelId={panelId} />;
  const rightButton = customRightButton !== undefined
    ? (
      <>
        {multifunctionalModeButton}
        {customRightButton}
      </>
    ) : multifunctionalModeButton;

  // The header starts the drags; tabs and the title have drags of their own
  let customTitle;
  if (isInSection) {
    customTitle = (
      <>
        {canMove && (
          <ArrangeMenu
            tool={menuTool ?? panelId}
            isForcedOpen={menuTool !== null}
            onClose={() => setMenuTool(null)}
          />
        )}
        {tabs.length > 1
          ? <SectionTabs panelId={panelId} tabs={tabs} onOpenMenu={setMenuTool} />
          : <SectionTitle tool={panelId} count={count} />}
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
          icon: isInSection || !isDocked ? 'minus' : 'close',
          label: resolvedCloseLabel,
          onClick: isInSection ? minimizeSection : closePanel,
          ...closeButtonProps,
        }}
        customRightButton={rightButton}
      />
      {drag && <DragOverlay drag={drag} />}
    </>
  );
};

export default PanelHeader;
