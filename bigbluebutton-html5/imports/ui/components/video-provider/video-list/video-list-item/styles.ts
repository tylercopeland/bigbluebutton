// @ts-nocheck
/* eslint-disable */
import styled, { keyframes, css } from 'styled-components';
import {
  colorWhite,
  webcamBackgroundColor,
  colorDanger,
  roomLive,
  webcamTileBorder,
  webcamVideoBackground,
  webcamRaisedHandBg,
  webcamRaisedHandColor,
} from '/imports/ui/stylesheets/styled-components/palette';
import { TextElipsis } from '/imports/ui/stylesheets/styled-components/placeholders';
import { UserCameraButtonsContainerWrapperProps } from './types'

const rotate360 = keyframes`
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
`;

const fade = keyframes`
  from {
    opacity: 0.7;
  }
  to {
    opacity: 0;
  }
`;

const Content = styled.div<{
  isStream: boolean;
  talking: boolean;
  customHighlight: boolean;
  animations: boolean;
  dragging: boolean;
  draggingOver: boolean;
  fullscreen: boolean;
}>`
  position: relative;
  display: flex;
  min-width: 100%;
  border-radius: 10px;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    border: 1px solid ${webcamTileBorder};
    border-radius: 10px;

    ${({ talking }) => talking && `
      border: 2px solid ${roomLive};
    `}

    ${({ talking, customHighlight }) => talking && customHighlight && customHighlight.length > 0 && `
      border: 2px solid rgb(${customHighlight[0]}, ${customHighlight[1]}, ${customHighlight[2]});
    `}

    ${({ animations }) => animations && `
      transition: opacity .1s;
    `}
  }

  ${({ dragging, animations }) => dragging && animations && css`
    &::after {
      animation: ${fade} .5s linear infinite;
      animation-direction: alternate;
    }
  `}

  ${({ dragging, draggingOver }) => (dragging || draggingOver) && `
    &::after {
      opacity: 0.7;
      border-style: dashed;
      border-color: ${colorDanger};
      transition: opacity 0s;
    }
  `}

  ${({ fullscreen }) => fullscreen && `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99;
  `}
`;

const WebcamConnecting = styled.div<{
  animations: boolean;
  talking: boolean;
  customHighlight: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  min-width: 100%;
  border-radius: 10px;
  background-color: ${webcamBackgroundColor};
  z-index: 0;

  ${({ talking, customHighlight }) => talking && customHighlight && customHighlight.length > 0 && `
    background-color: rgba(${customHighlight[0]}, ${customHighlight[1]}, ${customHighlight[2]}, 0.15);
  `}

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;

    ${({ animations }) => animations && `
      transition: opacity .1s;
    `}
  }
`;

const LoadingText = styled(TextElipsis)`
  color: ${colorWhite};
  font-size: 100%;
`;

const VideoContainer = styled.div<{
  $selfViewDisabled: boolean;
}>`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;

  ${({ $selfViewDisabled }) => $selfViewDisabled && 'display: none'}
`;

const Video = styled.video<{
  mirrored: boolean;
  unhealthyStream: boolean;
}>`
  position: relative;
  height: 100%;
  width: calc(100% - 1px);
  object-fit: contain;
  background-color: ${webcamVideoBackground};
  border-radius: 10px;

  ${({ mirrored }) => mirrored && `
    transform: scale(-1, 1);
  `}

  ${({ unhealthyStream }) => unhealthyStream && `
    filter: grayscale(50%) opacity(50%);
  `}
`;

const VideoDisabled = styled.div`
  color: white;
  width: 100%;
  height: 20%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  border-radius: 10px;
  z-index: 2;
  top: 40%;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const TopBar = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  z-index: 1;
  top: 0;
  padding: 6px;
  justify-content: space-between;
  gap: 4px;
`;

const BottomBar = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  z-index: 1;
  bottom: 0;
  padding: 0 6px 6px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 6px;
`;

const SqueezedName = styled(TextElipsis)`
  color: ${colorWhite};
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 0 0.5rem;
  font-size: 80%;
  max-width: 100%;
`;

const RaiseHand = styled.div`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-width: 24px;
  height: 24px;
  box-sizing: border-box;
  margin-inline-start: auto;
  padding: 0 5px;
  border-radius: 12px;
  background-color: ${webcamRaisedHandBg};
  color: ${webcamRaisedHandColor};
`;

const RaiseHandNumber = styled.span`
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
`;

const UserCameraButtonsContainerWrapper = styled.div<UserCameraButtonsContainerWrapperProps>`
  position: absolute;
  z-index: 2;
  display: flex;
  width: 50%;

  ${({ positionXAxis }) => positionXAxis === 'right' && `
    right: 0;
    flex-direction: row-reverse;
  `}
  ${({ positionXAxis }) => positionXAxis === 'left' && `
    left: 0;
  `}

  ${({ positionYAxis }) => positionYAxis === 'top' && `
    top: 0;
  `}
  ${({ positionYAxis }) => positionYAxis === 'bottom' && `
    bottom: 0;
  `}
`;

export default {
  Content,
  UserCameraButtonsContainerWrapper,
  WebcamConnecting,
  LoadingText,
  VideoContainer,
  Video,
  TopBar,
  BottomBar,
  SqueezedName,
  VideoDisabled,
  RaiseHand,
  RaiseHandNumber,
};
