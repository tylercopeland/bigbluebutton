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
  emptyBody: {
    id: 'app.chat.direct.emptyBody',
    description: 'Explains how to start a private chat, under the empty state title',
    defaultMessage: 'Pick someone in People to send them a private message.',
  },
  emptyAction: {
    id: 'app.chat.direct.emptyAction',
    description: 'Button in the empty state that opens People',
    defaultMessage: 'Open People',
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
        <Styled.Empty data-test="noPrivateChats">
          <Styled.EmptyIcon aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3.5V15H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
              <path d="M18 8.5h1.5a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H19v2.5L16 19h-4.5" />
            </svg>
          </Styled.EmptyIcon>
          <Styled.EmptyTitle>{intl.formatMessage(intlMessages.empty)}</Styled.EmptyTitle>
          <Styled.EmptyBody>{intl.formatMessage(intlMessages.emptyBody)}</Styled.EmptyBody>
          <Styled.EmptyAction type="button" onClick={onOpenPeople} data-test="openPeopleFromChat">
            {intl.formatMessage(intlMessages.emptyAction)}
          </Styled.EmptyAction>
        </Styled.Empty>
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
      {chats.length > 0 && (
      <Styled.Hint>
        {intl.formatMessage(intlMessages.hint, {
          people: (text: React.ReactNode) => (
            <Styled.HintButton key="people" type="button" onClick={onOpenPeople} data-test="openPeopleFromChat">
              {text}
            </Styled.HintButton>
          ),
        })}
      </Styled.Hint>
      )}
    </Styled.ScrollableList>
  );
};

export default PrivateChatList;
