import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Styled from './styles';

const intlMessages = defineMessages({
  label: {
    id: 'app.chat.scope.label',
    description: 'Accessible label for the switch between everyone and direct messages',
    defaultMessage: 'Chat type',
  },
  everyone: {
    id: 'app.chat.scope.everyone',
    description: 'Switches to the public chat',
    defaultMessage: 'Everyone',
  },
  direct: {
    id: 'app.chat.scope.direct',
    description: 'Switches to the private chats',
    defaultMessage: 'Direct',
  },
  unread: {
    id: 'app.sidebarContent.tabs.unread',
    description: 'Accessible count of unread messages',
    defaultMessage: '{count, plural, one {# unread message} other {# unread messages}}',
  },
});

interface ChatScopeProps {
  isDirect: boolean;
  publicUnread: number;
  directUnread: number;
  onSelectEveryone: () => void;
  onSelectDirect: () => void;
}

const MAX_BADGE_COUNT = 99;

const ChatScope: React.FC<ChatScopeProps> = ({
  isDirect, publicUnread, directUnread, onSelectEveryone, onSelectDirect,
}) => {
  const intl = useIntl();

  const renderChip = (
    label: string, isSelected: boolean, unread: number, onClick: () => void,
    dataTest: string, unreadDataTest: string,
  ) => (
    <Styled.Chip type="button" aria-pressed={isSelected} data-test={dataTest} onClick={onClick}>
      <span>{label}</span>
      {unread > 0 && (
        <Styled.Badge
          role="img"
          aria-label={intl.formatMessage(intlMessages.unread, { count: unread })}
          data-test={unreadDataTest}
        >
          {unread > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : unread}
        </Styled.Badge>
      )}
    </Styled.Chip>
  );

  return (
    <Styled.Scope role="group" aria-label={intl.formatMessage(intlMessages.label)}>
      {renderChip(
        intl.formatMessage(intlMessages.everyone), !isDirect, isDirect ? publicUnread : 0,
        onSelectEveryone, 'publicChatButton', 'publicUnreadIndicator',
      )}
      {renderChip(
        intl.formatMessage(intlMessages.direct), isDirect, directUnread,
        onSelectDirect, 'privateChatButton', 'privateUnreadIndicator',
      )}
    </Styled.Scope>
  );
};

export default ChatScope;
