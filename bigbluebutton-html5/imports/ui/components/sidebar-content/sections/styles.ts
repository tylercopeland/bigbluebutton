import styled from 'styled-components';
import {
  colorPrimary,
  panelBorder,
  panelMutedText,
  panelTabsBg,
} from '/imports/ui/stylesheets/styled-components/palette';

const Section = styled.section<{ $share: number; $isMinimized: boolean; $isStacked: boolean }>`
  position: relative;
  display: flex;
  flex: ${({ $share }) => $share} 1 0;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;

  ${({ $isMinimized }) => $isMinimized && `
    flex: 0 0 auto;
  `}

  ${({ $isStacked }) => $isStacked && `
    & + & {
      border-top: 1px solid ${panelBorder};
    }
  `}

  @media (prefers-reduced-motion: no-preference) {
    transition: flex-grow .3s cubic-bezier(.2, .8, .2, 1);
  }
`;

const MinimizedHeader = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  height: 52px;
  padding-inline: var(--panel-inset, 12px);
  cursor: grab;
  touch-action: none;
`;

const MinimizedTitle = styled.button`
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  background: none;
  font-family: inherit;
  text-align: start;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const Expand = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: none;
  color: ${panelMutedText};
  cursor: pointer;

  &:hover {
    background-color: ${panelTabsBg};
  }

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: -2px;
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

export default {
  Section, Divider, MinimizedHeader, MinimizedTitle, Expand,
};
