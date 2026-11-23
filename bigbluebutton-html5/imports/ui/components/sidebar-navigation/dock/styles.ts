import styled from 'styled-components';
import {
  roomControlBg,
  roomControlHoverBg,
  roomControlColor,
  roomControlActiveBg,
  roomControlActiveColor,
  roomFocusRing,
} from '/imports/ui/stylesheets/styled-components/palette';
import { roomDockRadius, roomDockSize } from '/imports/ui/stylesheets/styled-components/general';

const Dock = styled.div`
  display: flex;
  align-items: center;
  gap: var(--room-bar-gap, 6px);

  && .bbb-navigation__item {
    width: ${roomDockSize};
    height: ${roomDockSize};
    flex-shrink: 0;
    border-radius: ${roomDockRadius};
    background-color: ${roomControlBg} !important;
    color: ${roomControlColor};
    box-shadow: none;

    & > i,
    & > svg {
      font-size: 1.2rem;
      color: inherit !important;
    }

    &:hover {
      background-color: ${roomControlHoverBg} !important;
    }

    &:focus-visible {
      box-shadow: 0 0 0 2px ${roomFocusRing};
    }
  }

  && .bbb-navigation__item--active,
  && .bbb-navigation__item--active:hover {
    background-color: ${roomControlActiveBg} !important;
    color: ${roomControlActiveColor};
  }

  && .bbb-navigation__item--disabled,
  && .bbb-navigation__item--locked {
    opacity: .5;
  }
`;

export default { Dock };
