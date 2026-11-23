import React, { useEffect } from 'react';
import { defineMessages, FormattedTime, useIntl } from 'react-intl';
import { layoutSelect, layoutSelectInput, layoutDispatch } from '/imports/ui/components/layout/context';
import { ACTIONS, PANELS } from '/imports/ui/components/layout/enums';
import Styled from './styles';
import { Input, Layout } from '/imports/ui/components/layout/layoutTypes';
import { Chat } from '/imports/ui/Types/chat';

const intlMessages = defineMessages({
  offline: {
    id: 'app.chat.offline',
    description: 'Offline',
  },
  privateChatUnkownUser: {
    id: 'app.userList.chatListItem.unknownParticipant',
  },
  privateChatDeletedMessage: {
    id: 'app.chat.deleteMessage',
  },
  privateChatAriaLabelNoUnread: {
    id: 'app.userList.chatListItem.noUnread',
  },
  privateChatAriaLabelSingular: {
    id: 'app.userList.chatListItem.unreadSingular',
  },
  privateChatAriaLabelPlural: {
    id: 'app.userList.chatListItem.unreadPlural',
  },
});

interface PrivateChatListItemProps {
  chat: Partial<Chat>;
  index: number;
  privateChatSelectedCallback: () => void;
}

const PrivateChatListItem = (props: PrivateChatListItemProps) => {
  const sidebarContent = layoutSelectInput((i: Input) => i.sidebarContent);
  const idChatOpen = layoutSelect((i: Layout) => i.idChatOpen);
  const layoutContextDispatch = layoutDispatch();
  const chatCountTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [unreadMessagesToDisplay, setUnreadMessagesToDisplay] = React.useState(0);
  const intl = useIntl();

  const { sidebarContentPanel } = sidebarContent;
  const sidebarContentIsOpen = sidebarContent.isOpen;

  const {
    chat,
    index,
    privateChatSelectedCallback,
  } = props;

  const chatPanelOpen = sidebarContentIsOpen && sidebarContentPanel === PANELS.CHAT;

  const isCurrentChat = chat.chatId === idChatOpen && chatPanelOpen;

  const ROLE_MODERATOR = window.meetingClientSettings.public.user.role_moderator;

  useEffect(() => {
    // Clear any previous timeout to prevent multiple executions
    clearTimeout(chatCountTimeoutRef.current);
    if (chat.totalUnread !== undefined && chat.totalUnread !== unreadMessagesToDisplay) {
      // Only update the unread count if the user is actively receiving new messages (not when they're reading)
      if (isCurrentChat && chat.totalUnread > 0) {
        // Delay updating the unread count by 2 seconds when the user is viewing this chat
        // This delay prevents showing the unread count while the user is already viewing the chat,
        // but the UpdateChatLastSeen mutation hasn't been triggered yet.
        // This delay is also implemented for performance reasons, as we're transferring this behavior from the server.
        chatCountTimeoutRef.current = setTimeout(() => {
          setUnreadMessagesToDisplay(chat.totalUnread ?? 0);
        }, 2000);
      } else {
        // Immediately update the unread count if the user is not viewing the chat or if there are no new messages
        setUnreadMessagesToDisplay(chat.totalUnread);
      }
    }

    return () => {
      if (chatCountTimeoutRef.current) {
        clearTimeout(chatCountTimeoutRef.current);
        chatCountTimeoutRef.current = undefined;
      }
    };
  }, [chat.totalUnread, isCurrentChat, unreadMessagesToDisplay]);

  const handleClickOpenPrivateChat = () => {
    layoutContextDispatch({
      type: ACTIONS.SET_ID_CHAT_OPEN,
      value: chat.chatId,
    });
    privateChatSelectedCallback();
  };

  const unreadCount = unreadMessagesToDisplay;
  const participantName = chat.participant?.name || intl.formatMessage(intlMessages.privateChatUnkownUser);
  const noUnreadMessagesLabel = intl.formatMessage(intlMessages.privateChatAriaLabelNoUnread);
  const unreadMessagesLabel = intl.formatMessage(
    unreadCount > 1
      ? intlMessages.privateChatAriaLabelPlural
      : intlMessages.privateChatAriaLabelSingular, {
      unreadCount,
    },
  );
  const ariaLabel = unreadCount > 0 ? unreadMessagesLabel : noUnreadMessagesLabel;

  // The last message preview now comes from the chats subscription itself (issue 25416),
  // so it renders with the item on the first paint instead of after a separate per-item
  // subscription that mounted the row a moment later and shifted the list.
  const hasLastMessage = chat.lastMessageAt != null;
  // A soft-deleted last message keeps its row with message=NULL and deletedByUserId set;
  // reuse the existing localized "deleted by {userName}" label shown in the message list.
  const isLastMessageDeleted = hasLastMessage && chat.lastMessage == null;
  const lastMessage = isLastMessageDeleted
    ? intl.formatMessage(intlMessages.privateChatDeletedMessage, { userName: chat.lastMessageDeletedByName ?? '' })
    : (chat.lastMessage ?? '');
  const lastMessageTime = chat.lastMessageAt ? new Date(chat.lastMessageAt) : null;

  const isOffline = chat.participant?.currentlyInMeeting === false;

  return (
    <Styled.ChatListItem
      type="button"
      data-test="privateChatItem"
      aria-current={isCurrentChat || undefined}
      tabIndex={-1}
      onClick={handleClickOpenPrivateChat}
      id={`chat-list-${index}`}
    >
      {chat.participant && (
        <Styled.Avatar
          moderator={chat.participant.role === ROLE_MODERATOR}
          avatar={chat.participant.avatar}
        >
          {/* @ts-ignore - UserAvatar is JS, so its inferred children type is null */}
          <span>{chat.participant.avatar?.length ? '' : participantName.toLowerCase().slice(0, 2)}</span>
        </Styled.Avatar>
      )}
      <Styled.Text>
        <Styled.Name data-test="private-user-list-header">
          <bdi>{participantName}</bdi>
          {isOffline && <Styled.Offline>{` (${intl.formatMessage(intlMessages.offline)})`}</Styled.Offline>}
        </Styled.Name>
        {hasLastMessage && (
          <Styled.Preview
            dir="auto"
            data-test="private-user-list-content"
            $isUnread={unreadMessagesToDisplay > 0}
          >
            {lastMessage}
          </Styled.Preview>
        )}
      </Styled.Text>
      <Styled.Meta>
        {lastMessageTime && (
          <Styled.Time><FormattedTime value={lastMessageTime} /></Styled.Time>
        )}
        {unreadMessagesToDisplay > 0 && (
          <Styled.Unread role="img" data-test="unreadMessages" aria-label={ariaLabel}>
            {unreadMessagesToDisplay}
          </Styled.Unread>
        )}
      </Styled.Meta>
    </Styled.ChatListItem>
  );
};

export default PrivateChatListItem;
