import styled from 'styled-components';
import {
  colorPrimary,
  panelMutedText,
  panelSectionCount,
  panelSectionTitle,
  panelTabsBg,
} from '/imports/ui/stylesheets/styled-components/palette';

// The Arrange menu's button, for keyboard and screen reader users. It stays
// invisible until it has keyboard focus or its menu is open, and then sits in
// the header's side padding so the title and tabs don't move. Mouse users drag
// the header or tabs, or right-click a title or tab for the same menu.
const Grip = styled.button`
  position: absolute;
  inset-block-start: 10px;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: none;
  color: ${panelMutedText};
  cursor: grab;
  touch-action: none;
  opacity: 0;

  @media (prefers-reduced-motion: no-preference) {
    transition: opacity .15s ease;
  }

  /* While invisible, a press lands on the header and starts a drag */
  pointer-events: none;

  &:focus-visible,
  &[aria-expanded="true"] {
    opacity: 1;
    pointer-events: auto;
  }

  &:hover {
    background-color: ${panelTabsBg};
  }

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: -2px;
  }
`;

// "People 14"
const Title = styled.h2`
  display: flex;
  flex: 1;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  margin: 0;
  padding-block: 8px;
  overflow: hidden;
  color: ${panelSectionTitle};
  font-size: 14px;
  font-weight: 700;
  line-height: normal;
  white-space: nowrap;
`;

const TitleText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Count = styled.span`
  flex-shrink: 0;
  color: ${panelSectionCount};
`;

export default {
  Grip, Title, TitleText, Count,
};
