import React from 'react';
import { createPortal } from 'react-dom';
import { defineMessages, useIntl } from 'react-intl';
import { layoutSelectOutput } from '/imports/ui/components/layout/context';
import { Output } from '/imports/ui/components/layout/layoutTypes';
import { SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH } from '/imports/ui/components/layout/defaultValues';
import Styled from './styles';

const intlMessages = defineMessages({
  drop: {
    id: 'app.sidebarContent.dropHere',
    description: 'Shown where the panel goes when it is dropped',
    defaultMessage: 'Move panel here',
  },
});

interface DropSideProps {
  side: 'left' | 'right';
  isNewSide: boolean;
}

// Shows where the dragged panel goes. It covers the window, so that nothing under
// the pointer reacts to the drag.
const DropSide: React.FC<DropSideProps> = ({ side, isNewSide }) => {
  const intl = useIntl();
  const panel = layoutSelectOutput((i: Output) => i.sidebarContent);
  const auxiliaryPanel = layoutSelectOutput((i: Output) => i.sidebarContentAuxiliary);
  const width = (panel.display ? panel.width : 0)
    + (auxiliaryPanel.display ? auxiliaryPanel.width : 0)
    - window.innerWidth * SIDEBAR_CONTENT_MARGIN_TO_MEDIA_PERCENTAGE_WIDTH;

  return createPortal(
    <Styled.Overlay data-test="panelDropOverlay">
      <Styled.Target
        $isNewSide={isNewSide}
        style={{ width, [side]: 0 }}
        data-test={`panelDrop-${side}`}
      >
        {isNewSide && intl.formatMessage(intlMessages.drop)}
      </Styled.Target>
    </Styled.Overlay>,
    document.body,
  );
};

export default DropSide;
