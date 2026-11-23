import styled from 'styled-components';
import {
  colorWhite,
  colorDanger,
  panelTabsBg,
  panelTabColor,
  panelTabActiveColor,
  panelRaisedHandBadge,
  roomFocusRing,
} from '/imports/ui/stylesheets/styled-components/palette';

const TabList = styled.div`
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  padding: 3px;
  border-radius: 10px;
  background-color: ${panelTabsBg};
`;

const Tab = styled.button`
  flex: 1 1 0;
  min-width: 0;
  height: 32px;
  border: 0;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: .95rem;
  font-weight: 700;
  background-color: transparent;
  color: ${panelTabColor};

  &[aria-selected='true'] {
    background-color: ${colorWhite};
    color: ${panelTabActiveColor};
    box-shadow: 0 1px 2px rgba(15, 23, 36, .12);
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: 1px;
  }
`;

const TabLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Badge = styled.span<{ $isRaisedHand?: boolean }>`
  flex-shrink: 0;
  min-width: 18px;
  height: 18px;
  box-sizing: border-box;
  padding: 0 5px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  line-height: 1;
  color: #FFF;
  background-color: ${({ $isRaisedHand }) => ($isRaisedHand ? panelRaisedHandBadge : colorDanger)};
`;

export default {
  TabList, Tab, TabLabel, Badge,
};
