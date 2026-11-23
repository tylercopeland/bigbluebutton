import React, { memo } from 'react';
import { layoutSelectInput } from '/imports/ui/components/layout/context';
import { Input } from '/imports/ui/components/layout/layoutTypes';
import PinnedApps from '../pinned-apps/component';
import SIDEBAR_BUTTONS_REGISTRY, { PINNED_APPS_BUTTON_ID } from '../buttons-registry';
import useIsNavigationDocked from '../hooks/useIsNavigationDocked';
import NavigationDockContext from './context';
import Styled from './styles';

interface NavigationDockProps {
  section: 'start' | 'end';
}

const PROFILE_BUTTON_ID = 'profile';

const NavigationDock: React.FC<NavigationDockProps> = ({ section }) => {
  const isDocked = useIsNavigationDocked();
  const sidebarNavigationInput = layoutSelectInput((i: Input) => i.sidebarNavigation);

  if (!isDocked || !sidebarNavigationInput.isOpen) return null;

  const {
    top = [],
    center = [],
    bottom = [],
  } = window.meetingClientSettings.public.sidebarNavigation.buttons;
  const all: string[] = [...top, ...center, ...bottom];
  // Room panels go on the left; personal and session tools go on the right.
  const isEnd = (id: string) => id === PROFILE_BUTTON_ID || bottom.includes(id);
  const buttonIds = all.filter((id) => isEnd(id) === (section === 'end'));

  return (
    <NavigationDockContext.Provider value>
      <Styled.Dock className={`bbb-navigation-dock bbb-navigation-dock--${section}`}>
        {buttonIds.map((buttonId) => {
          if (buttonId === PINNED_APPS_BUTTON_ID) {
            return (
              <PinnedApps
                key={buttonId}
                sidebarNavigationInput={sidebarNavigationInput}
              />
            );
          }
          const ButtonComponent = SIDEBAR_BUTTONS_REGISTRY[buttonId];
          return ButtonComponent ? <ButtonComponent key={buttonId} /> : null;
        })}
      </Styled.Dock>
    </NavigationDockContext.Provider>
  );
};

export default memo(NavigationDock);
