import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Icon from '/imports/ui/components/common/icon/component';
import usePanelDrag from '/imports/ui/components/common/panel-header/usePanelDrag';
import DragOverlay from '/imports/ui/components/common/panel-header/drag-overlay/component';
import ArrangeMenu from '/imports/ui/components/common/panel-header/arrange-menu/component';
import TitleStyled from '/imports/ui/components/common/panel-header/section-title/styles';
import usePanelSections from './usePanelSections';
import useToolName from './useToolName';
import { PanelSection } from './model';
import Styled from './styles';

const intlMessages = defineMessages({
  restore: {
    id: 'app.sidebarContent.restoreSection',
    description: 'Label for the button that restores a minimized section of the side panel',
    defaultMessage: 'Restore {name}',
  },
});

interface MinimizedSectionProps {
  index: number;
  section: PanelSection;
}

/** A minimized section keeps its header, so it can be restored, arranged or dragged */
const MinimizedSection: React.FC<MinimizedSectionProps> = ({ index, section }) => {
  const intl = useIntl();
  const toolName = useToolName();
  const { expand } = usePanelSections();
  const { onPointerDown, canMove, drag } = usePanelDrag();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const names = section.tabs.map(toolName).join(' · ');
  const restoreLabel = intl.formatMessage(intlMessages.restore, { name: names });

  return (
    <Styled.MinimizedHeader onPointerDown={onPointerDown} data-test="minimizedSection">
      {canMove && (
        <ArrangeMenu
          tool={section.active}
          isForcedOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
      <Styled.MinimizedTitle
        type="button"
        data-section-title={section.active}
        aria-label={restoreLabel}
        onClick={() => expand(index)}
        onKeyDown={(event: React.KeyboardEvent) => {
          if (event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)) {
            event.preventDefault();
            setIsMenuOpen(true);
          }
        }}
      >
        <TitleStyled.Title as="span">
          <TitleStyled.TitleText>{names}</TitleStyled.TitleText>
        </TitleStyled.Title>
      </Styled.MinimizedTitle>
      <Styled.Expand
        type="button"
        aria-label={restoreLabel}
        title={restoreLabel}
        data-test="restoreSection"
        onClick={() => expand(index)}
      >
        <Icon iconName="add" />
      </Styled.Expand>
      {drag && <DragOverlay drag={drag} />}
    </Styled.MinimizedHeader>
  );
};

export default MinimizedSection;
