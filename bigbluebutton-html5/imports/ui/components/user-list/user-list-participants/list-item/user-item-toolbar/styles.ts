import styled from 'styled-components';
import {
  panelRowActionBg,
  panelRowActionColor,
  panelRowActionHoverBg,
  panelRowHoverBg,
  roomFocusRing,
} from '/imports/ui/stylesheets/styled-components/palette';

// Floats over the end of the name until the row is hovered or focused, so names
// get the full width. Without a hover-capable pointer it is always in the row.
const ToolbarContainer = styled.div<{ $isOpen?: boolean }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;

  @media (hover: hover) {
    position: absolute;
    top: 0;
    bottom: 0;
    inset-inline-end: 58px;
    padding-inline: 8px;
    background-color: ${panelRowHoverBg};
    opacity: 0;
    pointer-events: none;

    ${({ $isOpen }) => $isOpen && `
      opacity: 1;
      pointer-events: auto;
    `}
  }
`;

const ToolbarButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background-color: ${panelRowActionBg};
  color: ${panelRowActionColor};
  font-size: .85rem;
  cursor: pointer;

  &:hover {
    background-color: ${panelRowActionHoverBg};
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: 1px;
  }

  &:disabled {
    cursor: not-allowed;
  }

  @media (hover: none) {
    width: 32px;
    height: 32px;
  }
`;

export default {
  ToolbarContainer,
  ToolbarButton,
};
