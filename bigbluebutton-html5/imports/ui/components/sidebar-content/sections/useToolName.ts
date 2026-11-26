import { useCallback } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { layoutSelectInput } from '/imports/ui/components/layout/context';
import { Input } from '/imports/ui/components/layout/layoutTypes';
import { PANELS } from '/imports/ui/components/layout/enums';

const intlMessages = defineMessages({
  [PANELS.USERLIST]: {
    id: 'app.sidebarContent.tabs.people',
    description: 'Label for the people tab',
    defaultMessage: 'People',
  },
  [PANELS.CHAT]: {
    id: 'app.sidebarContent.tabs.chat',
    description: 'Label for the chat tab',
    defaultMessage: 'Chat',
  },
  [PANELS.SHARED_NOTES]: {
    id: 'app.sidebarContent.tabs.notes',
    description: 'Label for the notes tab',
    defaultMessage: 'Notes',
  },
  [PANELS.POLL]: {
    id: 'app.sidebarContent.tabs.poll',
    description: 'Label for the poll tab',
    defaultMessage: 'Poll',
  },
  [PANELS.BREAKOUT]: {
    id: 'app.sidebarContent.tabs.breakouts',
    description: 'Label for the breakout rooms tab',
    defaultMessage: 'Breakout rooms',
  },
  [PANELS.AUDIO_CAPTIONS]: {
    id: 'app.sidebarContent.tabs.captions',
    description: 'Label for the captions tab',
    defaultMessage: 'Captions',
  },
  [PANELS.PROFILE]: {
    id: 'app.sidebarContent.tabs.profile',
    description: 'Label for the profile tab',
    defaultMessage: 'Profile',
  },
  [PANELS.TIMER]: {
    id: 'app.sidebarContent.tabs.timer',
    description: 'Label for the timer tab',
    defaultMessage: 'Timer',
  },
});

/** Short names for the tools in the panel, for tabs, titles and announcements */
const useToolName = () => {
  const intl = useIntl();
  const registeredApps = layoutSelectInput((i: Input) => i.sidebarNavigation.registeredApps);

  return useCallback((tool: string): string => {
    const message = intlMessages[tool as keyof typeof intlMessages];
    if (message) return intl.formatMessage(message);
    return registeredApps?.[tool]?.name ?? tool;
  }, [intl, registeredApps]);
};

export default useToolName;
