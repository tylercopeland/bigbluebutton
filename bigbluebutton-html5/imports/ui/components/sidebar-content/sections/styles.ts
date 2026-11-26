import styled from 'styled-components';
import {
  colorWhite,
  colorPrimary,
  panelBorder,
} from '/imports/ui/stylesheets/styled-components/palette';

const Section = styled.section<{ $share: number; $isStacked: boolean }>`
  position: relative;
  display: flex;
  flex: ${({ $share }) => $share} 1 0;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;

  ${({ $isStacked }) => $isStacked && `
    & + & {
      border-top: 1px solid ${panelBorder};
    }
  `}

  @media (prefers-reduced-motion: no-preference) {
    transition: flex-grow .3s cubic-bezier(.2, .8, .2, 1);
  }
`;

const Divider = styled.div`
  position: relative;
  flex-shrink: 0;
  height: 8px;
  margin-block: -4px;
  z-index: 1;
  background-color: transparent;
  cursor: ns-resize;
  touch-action: none;

  &::before {
    content: '';
    position: absolute;
    inset-inline: 0;
    inset-block-start: 4px;
    height: 1px;
    background-color: ${panelBorder};
  }

  &::after {
    content: '';
    position: absolute;
    inset-block-start: 2px;
    left: 50%;
    width: 28px;
    height: 2px;
    margin-left: -14px;
    border-radius: 1px;
    background-color: ${panelBorder};
  }

  &:hover::after,
  &:focus-visible::after {
    background-color: ${colorPrimary};
  }

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: -2px;
  }
`;

// The panel on the other side of the stage, for one docked tool
const Aside = styled.aside<{ $isOnRight: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${colorWhite};
  ${({ $isOnRight }) => ($isOnRight ? 'border-left' : 'border-right')}: 1px solid ${panelBorder};

  @media (prefers-reduced-motion: no-preference) {
    animation: bbb-aside-in .2s cubic-bezier(.2, .8, .2, 1);
  }

  @keyframes bbb-aside-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export default {
  Section, Divider, Aside,
};
