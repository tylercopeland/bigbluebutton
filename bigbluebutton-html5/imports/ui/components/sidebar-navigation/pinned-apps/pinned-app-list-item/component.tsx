import React, { memo, useContext } from 'react';
import { InjectedAppGalleryItem } from '/imports/ui/components/layout/layoutTypes';
import { PinnedAppProps } from '../types';
import { TIMER_APP_KEY } from '/imports/ui/components/timer/constants';
import useOpenTimerCard from '/imports/ui/components/timer/hooks/useOpenTimerCard';
import NavigationDockContext from '../../dock/context';
import SidebarNavigationButton from '/imports/ui/components/sidebar-navigation/sidebar-navigation-button/component';

const PinnedAppBase: React.FC<PinnedAppProps> = ({
  appKey,
  appInfo,
  isOpened,
  children,
}) => {
  const {
    name, icon, hasNotification, dataTest,
  } = appInfo;

  // type guard
  const { onClick: appOnClick } = (appInfo as InjectedAppGalleryItem);
  const isDocked = useContext(NavigationDockContext);
  const openTimerCard = useOpenTimerCard();
  // The docked timer is a floating card, so it has no panel to open
  const onClick = isDocked && appKey === TIMER_APP_KEY ? openTimerCard : appOnClick;

  return (
    <SidebarNavigationButton
      panel={typeof onClick === 'function' ? undefined : appKey}
      isOpened={isOpened}
      iconName={icon}
      label={name}
      hasNotification={hasNotification}
      id={`pinned-app-${appKey}`}
      dataTest={dataTest ? `sidebar_button_${dataTest}` : `${appKey}SidebarButton`}
      onClick={typeof onClick === 'function' ? onClick : undefined}
    >
      {children}
    </SidebarNavigationButton>
  );
};

export default memo(PinnedAppBase);
