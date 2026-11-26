import React from 'react';
import { PANELS } from '/imports/ui/components/layout/enums';
import ChatContainer from '/imports/ui/components/chat/chat-graphql/component';
import ProfileSettings from '/imports/ui/components/profile-settings/component';
import PollContainer from '/imports/ui/components/poll/container';
import UserListComponent from '/imports/ui/components/user-list/component';
import BreakoutRoomContainer from '/imports/ui/components/breakout-room/breakout-room/component';
import TimerContainer from '/imports/ui/components/timer/panel/component';
import ErrorBoundary from '/imports/ui/components/common/error-boundary/component';
import FallbackView from '/imports/ui/components/common/fallback-errors/fallback-view/component';
import AppsGallery from '/imports/ui/components/apps-gallery/container';
import GenericContentSidekickContainer from '/imports/ui/components/generic-content/generic-sidekick-content/container';
import AudioCaptionsPanel from '/imports/ui/components/audio-captions/panel/component';

/** A tool's content, for the side panel or the docked panel. Notes are left to the caller. */
const renderTool = (tool: string) => {
  switch (tool) {
    case PANELS.CHAT:
      return (
        <ErrorBoundary Fallback={FallbackView}>
          <ChatContainer />
        </ErrorBoundary>
      );
    case PANELS.USERLIST: return <UserListComponent />;
    case PANELS.SHARED_NOTES: return null;
    case PANELS.PROFILE: return <ProfileSettings />;
    case PANELS.BREAKOUT: return <BreakoutRoomContainer />;
    case PANELS.TIMER: return <TimerContainer />;
    case PANELS.POLL: return <PollContainer />;
    case PANELS.APPS_GALLERY: return <AppsGallery />;
    case PANELS.AUDIO_CAPTIONS: return <AudioCaptionsPanel />;
    default:
      return tool.includes(PANELS.GENERIC_CONTENT_SIDEKICK)
        ? <GenericContentSidekickContainer genericSidekickContentId={tool} />
        : null;
  }
};

export default renderTool;
