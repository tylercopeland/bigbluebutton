import React, { useContext } from 'react';
import { useReactiveVar } from '@apollo/client';
import Auth from '/imports/ui/services/auth';
import getFromUserSettings from '/imports/ui/services/users-settings';
import NavBar from './component';
import { layoutDispatch, layoutSelectOutput } from '../layout/context';
import { PluginsContext } from '/imports/ui/components/components-data/plugin-context/context';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import useMeeting from '../../core/hooks/useMeeting';
import useIsNavigationDocked from '/imports/ui/components/sidebar-navigation/hooks/useIsNavigationDocked';
import connectionStatus from '../../core/graphql/singletons/connectionStatus';

const NavBarContainer = (props) => {
  const { pluginsExtensibleAreasAggregatedState } = useContext(PluginsContext);

  const isNavigationDocked = useIsNavigationDocked();
  const navBar = layoutSelectOutput((i) => i.navBar);
  const layoutContextDispatch = layoutDispatch();

  const { data: currentUserData } = useCurrentUser((user) => ({
    isModerator: user.isModerator,
  }));
  const amIModerator = currentUserData?.isModerator;

  const hideNavBar = getFromUserSettings('bbb_hide_nav_bar', false);

  const PUBLIC_CONFIG = window.meetingClientSettings.public;
  const IS_DIRECT_LEAVE_BUTTON_ENABLED = getFromUserSettings(
    'bbb_direct_leave_button',
    PUBLIC_CONFIG.app.defaultSettings.application.directLeaveButton,
  );
  const SHOW_SESSION_DETAILS_ON_JOIN = getFromUserSettings(
    'bbb_show_session_details_on_join',
    PUBLIC_CONFIG.layout.showSessionDetailsOnJoin,
  );

  let meetingTitle;
  const connected = useReactiveVar(connectionStatus.getConnectedStatusVar());

  const { data: meeting } = useMeeting((m) => ({
    name: m.name,
    meetingId: m.meetingId,
  }));

  if (meeting) {
    meetingTitle = meeting.name;
  }

  if (hideNavBar || navBar.display === false) return null;

  let pluginNavBarItems = [];
  if (pluginsExtensibleAreasAggregatedState.navBarItems) {
    pluginNavBarItems = [
      ...pluginsExtensibleAreasAggregatedState.navBarItems,
    ];
  }

  return (
    <NavBar
      {...{
        amIModerator,
        layoutContextDispatch,
        currentUserId: Auth.userID,
        pluginNavBarItems,
        meetingId: meeting?.meetingId,
        presentationTitle: meetingTitle,
        isDirectLeaveButtonEnabled: IS_DIRECT_LEAVE_BUTTON_ENABLED,
        // TODO: Remove/Replace
        isConnected: connected,
        hideTopRow: navBar.hideTopRow,
        isNavigationDocked,
        showBrandingArea: getFromUserSettings(
          'bbb_display_branding_area',
          PUBLIC_CONFIG.app.branding.displayBrandingArea,
        ),
        showSessionDetailsOnJoin: SHOW_SESSION_DETAILS_ON_JOIN,
        ...props,
      }}
      style={{ ...navBar }}
    />
  );
};

export default NavBarContainer;
