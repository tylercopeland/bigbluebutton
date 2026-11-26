import styled from 'styled-components';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import {
  smPaddingX, smPaddingY, barsPadding, roomDockRadius, roomDockSize,
} from '/imports/ui/stylesheets/styled-components/general';
import {
  colorWhite,
  colorBackground,
  btnDefaultBg,
  btnDefaultColor,
  defaultBorder,
  roomControlBg,
  roomControlHoverBg,
  roomControlColor,
  roomControlActiveBg,
  roomControlActiveColor,
  roomLive,
  roomFocusRing,
  panelRowActionBg,
} from '/imports/ui/stylesheets/styled-components/palette';
import Button from '/imports/ui/components/common/button/component';

const ActionsBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;

const ActionsBarWrapper = styled.section`
  flex: 1;
  padding: ${barsPadding};
  background-color: ${colorBackground};
  position: relative;
  order: 3;

  ${({ $isCompact }) => $isCompact && `
    --room-dock-size: 36px;
    --room-control-size: 2.5rem;
    --room-bar-gap: 4px;
    overflow-x: auto;
    overflow-y: hidden;
  `}
`;

const ItemsGroup = `
  display: flex;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 1;
  gap: var(--room-bar-gap, ${smPaddingX});
`;

// Round media controls: dark at rest, light when on.
const roomControls = `
  && .bbb-button--circle > .bbb-button__icon,
  && .bbb-button--circle:focus > .bbb-button__icon {
    width: var(--room-control-size, 3rem);
    height: var(--room-control-size, 3rem);
    background-color: ${roomControlBg} !important;
    color: ${roomControlColor} !important;
    border-color: transparent !important;
    box-shadow: none !important;
    filter: none !important;
  }

  && .bbb-button--circle:hover > .bbb-button__icon {
    background-color: ${roomControlHoverBg} !important;
  }

  && .bbb-button--circle.bbb-button--primary > .bbb-button__icon,
  && .bbb-button--circle.bbb-button--primary:hover > .bbb-button__icon {
    background-color: ${roomControlActiveBg} !important;
    color: ${roomControlActiveColor} !important;
  }

  /* A raised hand is a light grey circle, not the tinted active blue */
  && .bbb-raise-hand-toggle.bbb-button--circle.bbb-button--primary > .bbb-button__icon,
  && .bbb-raise-hand-toggle.bbb-button--circle.bbb-button--primary:hover > .bbb-button__icon {
    background-color: ${panelRowActionBg} !important;
  }

  && .bbb-button--circle:focus-visible > .bbb-button__icon {
    box-shadow: 0 0 0 2px ${colorBackground}, 0 0 0 4px ${roomFocusRing} !important;
  }

  && .bbb-mute-toggle.bbb-button--primary > .bbb-button__icon {
    box-shadow: 0 0 0 2px ${colorBackground}, 0 0 0 4px ${roomLive} !important;
  }
`;

const Left = styled.div`
  ${ItemsGroup}
  flex-basis: 0;
  justify-content: flex-start;
  > *:not(span) {
    @media ${smallOnly} {
      margin: 0 ${smPaddingY};
    }
  }
  @media ${smallOnly} {
    bottom: ${smPaddingX};
    left: ${smPaddingX};
    right: auto;
    [dir="rtl"] & {
      left: auto;
      right: ${smPaddingX};
    }
  }
`;

const Center = styled.div`
  ${ItemsGroup}
  ${roomControls}
  justify-content: center;
`;

const Right = styled.div`
  ${ItemsGroup}
  flex-basis: 0;
  justify-content: flex-end;
  position: relative;
  gap: var(--room-bar-gap, 6px);
  [dir="rtl"] & {
    right: auto;
    left: ${smPaddingX};
  }
  @media ${smallOnly} {
    right: 0;
    left: 0;
    display: contents;
  }
  height: 100%;
`;

const PresentationButtonsWrapper = styled.div`
  color: ${btnDefaultColor};
  background-color: ${btnDefaultBg};
  border-radius: 3rem;
  display: flex;
  gap: .2rem;
  align-items: center;
  height: 100%;

  @media ${smallOnly} {
    height: 2.5rem;
    margin-left: ${smPaddingX};
    [dir="rtl"] & {
      margin-left: 0;
      margin-right: ${smPaddingX};
    }
  }

  ${({ $isDocked }) => $isDocked && `
    && {
      background-color: transparent;
      height: auto;
    }

    && .bbb-button--circle > .bbb-button__icon {
      width: ${roomDockSize};
      height: ${roomDockSize};
      border-radius: ${roomDockRadius};
      background-color: ${roomControlBg} !important;
      color: ${roomControlColor} !important;
      border-color: transparent !important;
      box-shadow: none !important;
    }

    && .bbb-button--circle:hover > .bbb-button__icon {
      background-color: ${roomControlHoverBg} !important;
    }

    && .bbb-button--circle:focus-visible > .bbb-button__icon {
      box-shadow: 0 0 0 2px ${roomFocusRing} !important;
    }
  `}
`;

const Divider = styled.div`
  border: .5px solid ${defaultBorder};
  height: 50%;
`;

const RaiseHandButton = styled(Button)`
  ${({ ghost }) => ghost && `
    & > span {
      box-shadow: none;
      background-color: transparent !important;
      border-color: ${colorWhite} !important;
    }
  `}
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  > * {
    margin: 8px;
  }
`;

const ReactionsDropdown = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  overflow: hidden;
  margin: 0.2em 0.2em 0.2em 0.2em;
  text-align: center;
  max-height: 270px;
  width: 270px;
  em-emoji {
    cursor: pointer;
  }
`;

const Separator = styled.div`
  height: 2.5rem;
  width: 0;
  border: 1px solid ${colorWhite};
  align-self: center;
  opacity: .75;
`;

const Gap = styled.div`
  display: flex;
  gap: .5rem;
`;

export default {
  ActionsBar,
  Left,
  Center,
  Right,
  PresentationButtonsWrapper,
  Divider,
  RaiseHandButton,
  ButtonContainer,
  ReactionsDropdown,
  Wrapper,
  ActionsBarWrapper,
  Gap,
  Separator,
};
