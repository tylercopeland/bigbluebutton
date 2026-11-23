import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Chat } from '/imports/ui/Types/chat';
import Styled from './styles';
import PrivateChatListItem from './chat-list-item/component';

const intlMessages = defineMessages({
  label: {
    id: 'app.chat.direct.listLabel',
    description: 'Accessible label for the list of private chats',
    defaultMessage: 'Direct messages',
  },
  empty: {
    id: 'app.chat.direct.empty',
    description: 'Shown when there are no private chats',
    defaultMessage: 'No direct messages yet',
  },
  hint: {
    id: 'app.chat.direct.hint',
    description: 'Explains how to start a private chat',
    defaultMessage: 'To start a private chat, pick someone in <people>People</people>.',
  },
});

interface PrivateChatListProps {
  chats: Partial<Chat>[];
  privateChatSelectedCallback: () => void;
  onOpenPeople: () => void;
}

// Arrow keys move between conversations, which are a single tab stop
const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button'));
  const current = items.indexOf(document.activeElement as HTMLElement);
  event.preventDefault();
  event.stopPropagation();
  items[current + (event.key === 'ArrowDown' ? 1 : -1)]?.focus();
};

const PrivateChatList: React.FC<PrivateChatListProps> = ({
  chats, privateChatSelectedCallback, onOpenPeople,
}) => {
  const intl = useIntl();

  return (
    <Styled.ScrollableList>
      {chats.length === 0 ? (
        <Styled.Empty data-test="noPrivateChats">{intl.formatMessage(intlMessages.empty)}</Styled.Empty>
      ) : (
        <Styled.List
          role="list"
          tabIndex={0}
          aria-label={intl.formatMessage(intlMessages.label)}
          onKeyDown={handleKeyDown}
        >
          {chats.map((chat, index) => (
            <div role="listitem" key={chat.chatId}>
              <PrivateChatListItem
                chat={chat}
                index={index}
                privateChatSelectedCallback={privateChatSelectedCallback}
              />
            </div>
          ))}
        </Styled.List>
      )}
      <Styled.Hint>
        {intl.formatMessage(intlMessages.hint, {
          people: (text: React.ReactNode) => (
            <Styled.HintButton key="people" type="button" onClick={onOpenPeople} data-test="openPeopleFromChat">
              {text}
            </Styled.HintButton>
          ),
        })}
      </Styled.Hint>
    </Styled.ScrollableList>
  );
};

export default PrivateChatList;
