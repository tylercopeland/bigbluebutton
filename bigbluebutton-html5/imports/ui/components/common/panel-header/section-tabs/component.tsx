import React, { useEffect, useId, useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import KEYS from '/imports/utils/keys';
import { layoutSelect } from '/imports/ui/components/layout/context';
import { Layout } from '/imports/ui/components/layout/layoutTypes';
import { PANELS } from '/imports/ui/components/layout/enums';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';
import { RAISED_HAND_USERS, RaisedHandUsersSubscriptionResponse } from '/imports/ui/core/graphql/queries/users';
import useHasUnreadChatMessages from '/imports/ui/components/chat/hooks/useHasUnreadChatMessages';
import usePanelSections from '/imports/ui/components/sidebar-content/sections/usePanelSections';
import useToolName from '/imports/ui/components/sidebar-content/sections/useToolName';
import Styled from './styles';

const intlMessages = defineMessages({
  tabsLabel: {
    id: 'app.sidebarContent.tabs.label',
    description: 'Accessible label for the tabs in a panel section',
    defaultMessage: 'Panel tabs',
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
  menuHint: {
    id: 'app.sidebarContent.tabs.menuHint',
    description: 'Tells keyboard and screen reader users how to open the arrange menu on a tab',
    defaultMessage: 'Press Shift F10 for arrange options',
  },
});

interface SectionTabsProps {
  /** The tool that is showing, which renders this header */
  panelId: string;
  tabs: string[];
  /** Opens the arrange menu for a tab */
  onOpenMenu: (tool: string) => void;
}

const MAX_BADGE_COUNT = 99;
const formatCount = (count: number) => (count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : `${count}`);

const DATA_TESTS: Record<string, string> = {
  [PANELS.USERLIST]: 'peopleTab',
  [PANELS.CHAT]: 'chatTab',
};

// Each tool renders its own header, so the tabs remount on every switch. This
// carries keyboard focus over to the newly selected tab.
let toolToFocus: string | null = null;

const SectionTabs: React.FC<SectionTabsProps> = ({ panelId, tabs, onOpenMenu }) => {
  const intl = useIntl();
  const toolName = useToolName();
  const { openTool } = usePanelSections();
  const isRTL = layoutSelect((i: Layout) => i.isRTL);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const hintId = useId();
  const hasPeople = tabs.includes(PANELS.USERLIST);

  const { data: raisedHandsData } = useDeduplicatedSubscription<RaisedHandUsersSubscriptionResponse>(
    RAISED_HAND_USERS,
    { skip: !hasPeople },
  );
  const raisedHands = raisedHandsData?.user?.length ?? 0;
  const { totalUnreadMessages } = useHasUnreadChatMessages({
    isChatPanelOpened: panelId === PANELS.CHAT,
  });

  useEffect(() => {
    if (toolToFocus !== panelId) return;
    toolToFocus = null;
    selectedRef.current?.focus();
  }, []);

  const select = (target: string) => {
    if (target === panelId) return;
    toolToFocus = target;
    openTool(target);
  };

  // Arrow keys only move focus; Enter or Space selects. Selecting on focus would
  // trap keyboard users, as the chat panel focuses its message input when it opens.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const isMenuKey = event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey);
    if (isMenuKey && target.dataset.panel) {
      event.preventDefault();
      onOpenMenu(target.dataset.panel);
      return;
    }
    const previousKey = isRTL ? KEYS.ARROW_RIGHT : KEYS.ARROW_LEFT;
    const nextKey = isRTL ? KEYS.ARROW_LEFT : KEYS.ARROW_RIGHT;
    if (event.key !== previousKey && event.key !== nextKey) return;
    const all = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const index = all.indexOf(document.activeElement as HTMLButtonElement);
    const step = event.key === nextKey ? 1 : -1;
    event.preventDefault();
    all[(index + step + all.length) % all.length]?.focus();
  };

  const getCount = (tool: string) => {
    if (tool === PANELS.USERLIST) {
      return {
        count: raisedHands,
        label: intl.formatMessage(intlMessages.raisedHands, { count: raisedHands }),
        isRaisedHand: true,
      };
    }
    if (tool === PANELS.CHAT) {
      return {
        count: totalUnreadMessages,
        label: intl.formatMessage(intlMessages.unread, { count: totalUnreadMessages }),
        isRaisedHand: false,
      };
    }
    return { count: 0, label: '', isRaisedHand: false };
  };

  return (
    <Styled.TabList
      role="tablist"
      className="bbb-panel-tabs"
      aria-label={intl.formatMessage(intlMessages.tabsLabel)}
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tool) => {
        const isSelected = tool === panelId;
        const label = toolName(tool);
        const { count, label: countLabel, isRaisedHand } = getCount(tool);
        return (
          <Styled.Tab
            key={tool}
            ref={isSelected ? selectedRef : undefined}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={count > 0 ? `${label}, ${countLabel}` : label}
            aria-describedby={hintId}
            tabIndex={isSelected ? 0 : -1}
            data-test={DATA_TESTS[tool] ?? `${tool}Tab`}
            data-panel={tool}
            onClick={() => select(tool)}
            onContextMenu={(event: React.MouseEvent) => {
              event.preventDefault();
              onOpenMenu(tool);
            }}
          >
            <Styled.TabLabel>{label}</Styled.TabLabel>
            {count > 0 && (
              <Styled.Badge $isRaisedHand={isRaisedHand}>{formatCount(count)}</Styled.Badge>
            )}
          </Styled.Tab>
        );
      })}
      <Styled.Hint id={hintId}>{intl.formatMessage(intlMessages.menuHint)}</Styled.Hint>
    </Styled.TabList>
  );
};

export default SectionTabs;
