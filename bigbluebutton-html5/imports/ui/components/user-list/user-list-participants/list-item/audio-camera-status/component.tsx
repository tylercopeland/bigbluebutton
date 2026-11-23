import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { User } from '/imports/ui/Types/user';
import Tooltip from '/imports/ui/components/common/tooltip/component';
import Icon from '/imports/ui/components/common/icon/icon-ts/component';
import { useWhoIsTalking } from '/imports/ui/core/hooks/useWhoIsTalking';
import { useWhoIsUnmuted } from '/imports/ui/core/hooks/useWhoIsUnmuted';
import { ResolveAudioOption } from '../user-item-toolbar/types';
import {
  BarsIcon, CameraIcon, HeadphonesIcon, HeadphonesOffIcon, MicIcon, MicOffIcon,
} from '../icons/component';
import Styled, { AudioState } from './styles';

const intlMessages = defineMessages({
  notInAudio: {
    id: 'app.userList.status.notInAudio',
    description: 'Status of a user who has not joined audio',
    defaultMessage: 'Not in audio',
  },
  speaking: {
    id: 'app.userList.status.speaking',
    description: 'Status of a user who is speaking',
    defaultMessage: 'Speaking',
  },
  cameraOn: {
    id: 'app.userList.sharingWebcam',
    description: 'Text for identifying who is sharing webcam',
  },
});

const AUDIO_ICONS: Record<AudioState, React.FC> = {
  speaking: BarsIcon,
  live: MicIcon,
  muted: MicOffIcon,
  listening: HeadphonesIcon,
  none: HeadphonesOffIcon,
};

interface AudioCameraStatusProps {
  user: User;
  resolveAudioOption: ResolveAudioOption | null;
}

const getAudioState = (
  user: User, isInAudio: boolean, isUnmuted: boolean, isTalking: boolean,
): AudioState => {
  if (!isInAudio) return 'none';
  if (user.voice?.listenOnly || user.voice?.listenOnlyInputDevice) return 'listening';
  if (!isUnmuted) return 'muted';
  return isTalking ? 'speaking' : 'live';
};

// Two fixed columns, audio then camera. For those allowed to mute or unmute the
// user, the audio icon is also the control.
const AudioCameraStatus: React.FC<AudioCameraStatusProps> = ({ user, resolveAudioOption }) => {
  const intl = useIntl();
  const { data: isTalking } = useWhoIsTalking(user.userId);
  const { data: isUnmuted } = useWhoIsUnmuted(user.userId);

  const state = getAudioState(user, !!resolveAudioOption, !!isUnmuted, !!isTalking);
  const option = resolveAudioOption?.(!isUnmuted);
  const AudioIcon = AUDIO_ICONS[state];
  const isControl = !!option && !option.disabled;

  let label = option?.label ?? intl.formatMessage(intlMessages.notInAudio);
  if (state === 'speaking') {
    const speaking = intl.formatMessage(intlMessages.speaking);
    label = isControl ? `${speaking}. ${label}` : speaking;
  }

  const hasCamera = (user.cameras?.length ?? 0) > 0;

  return (
    <Styled.Columns>
      {!user.bot && (
        <Tooltip title={label}>
          {isControl ? (
            <Styled.AudioButton
              type="button"
              tabIndex={-1}
              $state={state}
              aria-label={label}
              onClick={option.onClick}
              data-test={option.dataTest}
            >
              <AudioIcon />
            </Styled.AudioButton>
          ) : (
            <Styled.Audio
              role="img"
              $state={state}
              aria-label={label}
              data-test={option?.dataTest.trim() ?? 'audioStateNotJoined'}
            >
              <AudioIcon />
            </Styled.Audio>
          )}
        </Tooltip>
      )}
      <Styled.Camera>
        {hasCamera && (
          <Tooltip title={intl.formatMessage(intlMessages.cameraOn)}>
            <Styled.CameraIcon
              role="img"
              aria-label={intl.formatMessage(intlMessages.cameraOn)}
              data-test="cameraStateOn"
            >
              {user.pinned ? <Icon iconName="pin-video_on" /> : <CameraIcon />}
            </Styled.CameraIcon>
          </Tooltip>
        )}
      </Styled.Camera>
    </Styled.Columns>
  );
};

export default AudioCameraStatus;
