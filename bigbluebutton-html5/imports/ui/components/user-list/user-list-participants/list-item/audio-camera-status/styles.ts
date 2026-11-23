import styled, { css } from 'styled-components';
import {
  panelLive,
  panelRowActionBg,
  panelStatusColor,
  panelStatusFaintColor,
  panelCameraColor,
  roomFocusRing,
} from '/imports/ui/stylesheets/styled-components/palette';

export type AudioState = 'speaking' | 'live' | 'muted' | 'listening' | 'none';

const STATE_COLORS: Record<AudioState, string> = {
  speaking: '#FFF',
  live: panelLive,
  muted: panelStatusColor,
  listening: panelStatusColor,
  none: panelStatusFaintColor,
};

const Columns = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 50px;
`;

const audioStyles = css<{ $state: AudioState }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: ${({ $state }) => STATE_COLORS[$state]};
  background-color: ${({ $state }) => ($state === 'speaking' ? panelLive : 'transparent')};
`;

const Audio = styled.span<{ $state: AudioState }>`
  ${audioStyles}
`;

const AudioButton = styled.button<{ $state: AudioState }>`
  ${audioStyles}
  padding: 0;
  border: 0;
  cursor: pointer;

  ${({ $state }) => $state !== 'speaking' && css`
    &:hover {
      background-color: ${panelRowActionBg};
    }
  `}

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: 1px;
  }
`;

const Camera = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 24px;
`;

const CameraIcon = styled.span`
  display: flex;
  color: ${panelCameraColor};
`;

export default {
  Columns,
  Audio,
  AudioButton,
  Camera,
  CameraIcon,
};
