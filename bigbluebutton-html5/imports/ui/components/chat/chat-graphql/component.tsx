import React, {
  useEffect,
  useMemo, useRef, useState,
} from 'react';
import { defineMessages, useIntl } from 'react-intl';
import KEYS from '/imports/utils/keys';
import BackButton from '/imports/ui/components/chat/chat-graphql/private-back-button/component';
import { useIsPrivateChatEnabled } from '/imports/ui/services/features';
import ChatScope from './chat-scope/component';
import ChatHeader from './chat-header/component';
import { layoutSelect, layoutSelectInput } from '../../layout/context';
import { Input, Layout } from '../../layout/layoutTypes';
import Styled from './styles';
import ChatMessageListContainer from './chat-message-list/component';
import PrivateChatListContainer from './private-chat-list/component';
import ChatMessageFormContainer from './chat-message-form/component';
import { PANELS, ACTIONS } from '/imports/ui/components/layout/enums';
import usePendingChat from '/imports/ui/core/local-states/usePendingChat';
import useChat from '/imports/ui/core/hooks/useChat';
import { Chat as ChatType } from '/imports/ui/Types/chat';
import { layoutDispatch } from '/imports/ui/components/layout/context';
import usePanelStack from '/imports/ui/components/sidebar-content/stack/usePanelStack';
import { GraphqlDataHookSubscriptionResponse } from '/imports/ui/Types/hook';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import { ChatEvents } from '/imports/ui/core/enums/chat';

const intlMessages = defineMessages({
  privacyNote: {
    id: 'app.chat.direct.privacyNote',
    description: 'Note shown above a private conversation',
    defaultMessage: 'Only you and {name} can see this conversation.',
  },
});

interface ChatProps {
  publicUnread: number;
  directUnread: number;
  chatId: string;
  participant?: ChatType['participant'];
  allPrivateChats: Partial<ChatType>[];
  shouldShowChatScope: boolean;
}

interface ChatLoadingProps {
  isRTL: boolean;
}

const Chat: React.FC<ChatProps> = ({
  publicUnread,
  directUnread,
  chatId,
  participant,
  allPrivateChats,
  shouldShowChatScope,
}) => {
  const CHAT_CONFIG = window.meetingClientSettings.public.chat;
  const PUBLIC_GROUP_CHAT_ID = CHAT_CONFIG.public_group_id;

  const isEditingMessage = useRef(false);
  const [privateList, setPrivateList] = useState(false);
  const layoutContextDispatch = layoutDispatch();
  const intl = useIntl();
  const isPrivateChat = chatId !== PUBLIC_GROUP_CHAT_ID;
  const isDirect = isPrivateChat || privateList;

  // A chat opened from elsewhere, like the people list, replaces the list
  useEffect(() => {
    setPrivateList(false);
  }, [chatId]);

  const openPublicChat = () => {
    setPrivateList(false);
    layoutContextDispatch({
      type: ACTIONS.SET_ID_CHAT_OPEN,
      value: PUBLIC_GROUP_CHAT_ID,
    });
  };

  const openPeople = () => {
    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
      value: PANELS.USERLIST,
    });
  };

  React.useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (window.getSelection && e.button !== 2) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KEYS.ESCAPE && isEditingMessage.current) {
        window.dispatchEvent(
          new CustomEvent(ChatEvents.CHAT_CANCEL_EDIT_REQUEST),
        );
      }
    };

    const handleEditingMessage = (e: Event) => {
      if (e instanceof CustomEvent) {
        isEditingMessage.current = true;
      }
    };

    const handleCancelEditingMessage = (e: Event) => {
      if (e instanceof CustomEvent) {
        isEditingMessage.current = false;
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener(ChatEvents.CHAT_EDIT_REQUEST, handleEditingMessage);
    window.addEventListener(ChatEvents.CHAT_CANCEL_EDIT_REQUEST, handleCancelEditingMessage);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener(ChatEvents.CHAT_EDIT_REQUEST, handleEditingMessage);
      window.removeEventListener(ChatEvents.CHAT_CANCEL_EDIT_REQUEST, handleCancelEditingMessage);
    };
  }, []);

  const renderChatPanelContent = () => {
    if (privateList) {
      return (
        <PrivateChatListContainer
          privateChatSelectedCallback={() => setPrivateList(false)}
          chats={allPrivateChats}
          onOpenPeople={openPeople}
        />
      );
    }
    return (
      <>
        {isPrivateChat && (
          <BackButton onClick={() => setPrivateList(true)} participant={participant} />
        )}
        {isPrivateChat && participant?.name && (
          <Styled.PrivacyNote>
            {intl.formatMessage(intlMessages.privacyNote, { name: participant.name })}
          </Styled.PrivacyNote>
        )}
        <ChatMessageListContainer />
        <ChatMessageFormContainer />
      </>
    );
  };

  return (
    <>
      <ChatHeader />
      <Styled.Separator />
      <Styled.ContentWrapper
        className="bbb-chat"
        id="scroll-box"
      >
        {shouldShowChatScope && (
          <ChatScope
            isDirect={isDirect}
            publicUnread={publicUnread}
            directUnread={directUnread}
            onSelectEveryone={openPublicChat}
            onSelectDirect={() => setPrivateList(true)}
          />
        )}
        {renderChatPanelContent()}
      </Styled.ContentWrapper>
    </>
  );
};

export const ChatLoading: React.FC<ChatLoadingProps> = () => {
  return (
    <Styled.LoadingWrapper>
      <Styled.CircularProgressContainer />
    </Styled.LoadingWrapper>
  );
};

const ChatContainer: React.FC = () => {
  const idChatOpen = layoutSelect((i: Layout) => i.idChatOpen);
  const isRTL = layoutSelect((i: Layout) => i.isRTL);
  const sidebarContent = layoutSelectInput((i: Input) => i.sidebarContent);
  const sidebarContentAuxiliary = layoutSelectInput((i: Input) => i.sidebarContentAuxiliary);
  const layoutContextDispatch = layoutDispatch();
  const { isStacked } = usePanelStack();
  const isPrivateChatEnabled = useIsPrivateChatEnabled();
  const { data: chats } = useChat((chat) => {
    return {
      chatId: chat.chatId,
      participant: chat.participant,
      totalUnread: chat.totalUnread,
      public: chat.public,
      totalMessages: chat.totalMessages,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      lastMessageDeletedByName: chat.lastMessageDeletedByName,
    };
  }) as GraphqlDataHookSubscriptionResponse<Partial<ChatType>[]>;

  const [pendingChat, setPendingChat] = usePendingChat();

  const PUBLIC_GROUP_CHAT_ID = window.meetingClientSettings.public.chat.public_group_id;
  const publicUnread = useMemo(() => (
    chats?.find((chat) => chat.chatId === PUBLIC_GROUP_CHAT_ID)?.totalUnread ?? 0
  ), [chats]);
  const directUnread = useMemo(() => (
    chats?.reduce((total, chat) => total + (chat.public ? 0 : chat.totalUnread ?? 0), 0) ?? 0
  ), [chats]);

  // All private chats (including empty ones) for navigation
  const allPrivateChats = useMemo(() => (chats || [] as ChatType[]).filter(
    (chat) => !chat.public,
  ), [chats]);

  // Check if any private chat exists (even empty ones)
  const hasAnyPrivateChat = allPrivateChats.length > 0;

  const pendingChatTarget = useMemo(() => {
    if (!pendingChat || !chats) return undefined;
    return chats.find((c) => c.participant?.userId === pendingChat);
  }, [pendingChat, chats]);

  useEffect(() => {
    if (!pendingChatTarget) return;
    setPendingChat('');
    layoutContextDispatch({
      type: ACTIONS.SET_ID_CHAT_OPEN,
      value: pendingChatTarget.chatId,
    });
  }, [pendingChatTarget, setPendingChat, layoutContextDispatch]);

  const resolvedChatId = pendingChatTarget?.chatId ?? idChatOpen;

  const participant = chats?.find((chat) => chat.chatId === resolvedChatId)?.participant;

  const { data: currentUser } = useCurrentUser((c) => ({
    userLockSettings: c?.userLockSettings,
    locked: c?.locked,
  }));

  const isLocked = currentUser?.locked || currentUser?.userLockSettings?.disablePublicChat;

  if (!isStacked && sidebarContent.sidebarContentPanel !== PANELS.CHAT
    && sidebarContentAuxiliary.sidebarContentPanel !== PANELS.CHAT) {
    return null;
  }
  if (!resolvedChatId && !isLocked) {
    if (sidebarContent.sidebarContentIsOpen) {
      return <ChatLoading isRTL={isRTL} />;
    }
    return null;
  }

  return (
    <Chat
      publicUnread={publicUnread}
      directUnread={directUnread}
      participant={participant}
      chatId={resolvedChatId}
      allPrivateChats={allPrivateChats}
      shouldShowChatScope={isPrivateChatEnabled || hasAnyPrivateChat || Boolean(pendingChat)}
    />
  );
};

export default ChatContainer;
