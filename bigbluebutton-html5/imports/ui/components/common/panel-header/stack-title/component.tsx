import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { PANELS } from '/imports/ui/components/layout/enums';
import Styled from './styles';

const intlMessages = defineMessages({
  people: {
    id: 'app.sidebarContent.tabs.people',
    description: 'Label for the people tab',
    defaultMessage: 'People',
  },
  chat: {
    id: 'app.sidebarContent.tabs.chat',
    description: 'Label for the chat tab',
    defaultMessage: 'Chat',
  },
});

const GRIP_DOTS = [6, 12, 18].flatMap((y) => [9, 15].map((x) => ({ x, y })));

// Moves the whole column. The options menu does the same without dragging.
export const ColumnGrip: React.FC = () => (
  <Styled.Grip aria-hidden="true" data-test="columnGrip">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      {GRIP_DOTS.map(({ x, y }) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.7" />)}
    </svg>
  </Styled.Grip>
);

const StackTitle: React.FC<{ panelId: string }> = ({ panelId }) => {
  const intl = useIntl();

  return (
    <Styled.Title data-stack-title={panelId}>
      {intl.formatMessage(panelId === PANELS.CHAT ? intlMessages.chat : intlMessages.people)}
    </Styled.Title>
  );
};

export default StackTitle;
