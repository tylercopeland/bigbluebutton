import React, { useEffect, useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import KEYS from '/imports/utils/keys';
import { layoutDispatch, layoutSelect } from '/imports/ui/components/layout/context';
import { Layout } from '/imports/ui/components/layout/layoutTypes';
import { ACTIONS, PANELS } from '/imports/ui/components/layout/enums';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';
import { RAISED_HAND_USERS, RaisedHandUsersSubscriptionResponse } from '/imports/ui/core/graphql/queries/users';
import useHasUnreadChatMessages from '/imports/ui/components/chat/hooks/useHasUnreadChatMessages';
import Styled from './styles';

const intlMessages = defineMessages({
  tabsLabel: {
    id: 'app.sidebarContent.tabs.label',
    description: 'Accessible label for the people and chat tabs',
    defaultMessage: 'People and chat',
  },
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
  raisedHands: {
    id: 'app.sidebarContent.tabs.raisedHands',
    description: 'Accessible count of raised hands',
    defaultMessage: '{count, plural, one {# raised hand} other {# raised hands}}',
  },
  unread: {
    id: 'app.sidebarContent.tabs.unread',
    description: 'Accessible count of unread messages',
    defaultMessage: '{count, plural, one {# unread message} other {# unread messages}}',
  },
});

interface PeopleChatTabsProps {
  panelId: string;
}

const MAX_BADGE_COUNT = 99;
const formatCount = (count: number) => (count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : `${count}`);

// Each panel renders its own header, so the tabs remount on every switch. This
// carries keyboard focus over to the newly selected tab.
let shouldFocusSelectedTab = false;

const PeopleChatTabs: React.FC<PeopleChatTabsProps> = ({ panelId }) => {
  const intl = useIntl();
  const layoutContextDispatch = layoutDispatch();
  const idChatOpen = layoutSelect((i: Layout) => i.idChatOpen);
  const isRTL = layoutSelect((i: Layout) => i.isRTL);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const isChat = panelId === PANELS.CHAT;

  const { data: raisedHandsData } = useDeduplicatedSubscription<RaisedHandUsersSubscriptionResponse>(
    RAISED_HAND_USERS,
  );
  const raisedHands = raisedHandsData?.user?.length ?? 0;
  const { totalUnreadMessages } = useHasUnreadChatMessages({ isChatPanelOpened: isChat });

  useEffect(() => {
    if (!shouldFocusSelectedTab) return;
    shouldFocusSelectedTab = false;
    selectedRef.current?.focus();
  }, []);

  const select = (target: string) => {
    if (target === panelId) return;
    shouldFocusSelectedTab = true;
    if (target === PANELS.CHAT && !idChatOpen) {
      layoutContextDispatch({
        type: ACTIONS.SET_ID_CHAT_OPEN,
        value: window.meetingClientSettings.public.chat.public_group_id,
      });
    }
    layoutContextDispatch({
      type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
      value: target,
    });
  };

  // Arrow keys only move focus; Enter or Space selects. Selecting on focus would
  // trap keyboard users, as the chat panel focuses its message input when it opens.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const previousKey = isRTL ? KEYS.ARROW_RIGHT : KEYS.ARROW_LEFT;
    const nextKey = isRTL ? KEYS.ARROW_LEFT : KEYS.ARROW_RIGHT;
    if (event.key !== previousKey && event.key !== nextKey) return;
    const [peopleTab, chatTab] = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
    event.preventDefault();
    (event.key === nextKey ? chatTab : peopleTab)?.focus();
  };

  const renderTab = (
    target: string, label: string, count: number, countLabel: string, dataTest: string,
  ) => {
    const isSelected = target === panelId;
    return (
      <Styled.Tab
        ref={isSelected ? selectedRef : undefined}
        type="button"
        role="tab"
        aria-selected={isSelected}
        aria-label={count > 0 ? `${label}, ${countLabel}` : label}
        tabIndex={isSelected ? 0 : -1}
        data-test={dataTest}
        data-panel={target}
        data-name={label}
        onClick={() => select(target)}
      >
        <Styled.TabLabel>{label}</Styled.TabLabel>
        {count > 0 && (
          <Styled.Badge $isRaisedHand={target === PANELS.USERLIST}>
            {formatCount(count)}
          </Styled.Badge>
        )}
      </Styled.Tab>
    );
  };

  return (
    <Styled.TabList
      role="tablist"
      className="bbb-panel-tabs"
      aria-label={intl.formatMessage(intlMessages.tabsLabel)}
      onKeyDown={handleKeyDown}
    >
      {renderTab(
        PANELS.USERLIST,
        intl.formatMessage(intlMessages.people),
        raisedHands,
        intl.formatMessage(intlMessages.raisedHands, { count: raisedHands }),
        'peopleTab',
      )}
      {renderTab(
        PANELS.CHAT,
        intl.formatMessage(intlMessages.chat),
        totalUnreadMessages,
        intl.formatMessage(intlMessages.unread, { count: totalUnreadMessages }),
        'chatTab',
      )}
    </Styled.TabList>
  );
};

export default PeopleChatTabs;
