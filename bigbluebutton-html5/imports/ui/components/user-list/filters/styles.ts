import styled from 'styled-components';
import {
  colorWhite,
  panelBorder,
  panelChipActiveBg,
  panelRaisedHandBadge,
  panelRowActionBg,
  panelRowHoverBg,
  panelText,
  roomFocusRing,
} from '/imports/ui/stylesheets/styled-components/palette';

const Filters = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px 14px 8px;
`;

const Count = styled.span<{ $isRaisedHands?: boolean }>`
  min-width: 18px;
  height: 18px;
  box-sizing: border-box;
  padding: 0 5px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  color: ${({ $isRaisedHands }) => ($isRaisedHands ? '#FFF' : panelText)};
  background-color: ${({ $isRaisedHands }) => ($isRaisedHands ? panelRaisedHandBadge : panelRowActionBg)};
`;

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 11px;
  border: 1px solid ${panelBorder};
  border-radius: 15px;
  background-color: ${colorWhite};
  color: ${panelText};
  font-family: inherit;
  font-size: .85rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: ${panelRowHoverBg};
  }

  &[aria-pressed='true'] {
    border-color: ${panelChipActiveBg};
    background-color: ${panelChipActiveBg};
    color: #FFF;
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: 1px;
  }
`;

const SearchButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  margin-inline-start: auto;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background-color: transparent;
  color: ${panelText};
  cursor: pointer;

  &:hover {
    background-color: ${panelRowHoverBg};
  }

  &[aria-expanded='true'] {
    background-color: ${panelRowActionBg};
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: 1px;
  }
`;

export default {
  Filters,
  Chip,
  Count,
  SearchButton,
};
