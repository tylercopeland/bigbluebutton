import styled from 'styled-components';
import { ScrollboxVertical } from '/imports/ui/stylesheets/styled-components/scrollable';
import {
  colorPrimary,
  panelMutedText,
  panelText,
  panelTabsBg,
  panelBorder,
  panelRowHoverBg,
  roomFocusRing,
} from '/imports/ui/stylesheets/styled-components/palette';

const ScrollableList = styled(ScrollboxVertical)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  margin: 0 -6px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-radius: 10px;

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: -2px;
  }
`;

// Centred a little above the middle, as one group
const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  padding: 24px 16px 15vh;
  max-width: 260px;
  text-align: center;
`;

const EmptyIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
  border-radius: 28px;
  background-color: ${panelTabsBg};
  color: ${panelMutedText};
`;

const EmptyTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 700;
  color: ${panelText};
`;

const EmptyBody = styled.p`
  margin: 0 0 16px;
  font-size: 13.5px;
  line-height: 1.45;
  color: ${panelMutedText};
`;

const EmptyAction = styled.button`
  height: 36px;
  padding: 0 14px;
  border: 1.5px solid ${panelBorder};
  border-radius: 10px;
  background: transparent;
  color: ${panelText};
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: ${panelRowHoverBg};
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: 2px;
  }
`;

const Hint = styled.div`
  margin-top: auto;
  padding: 12px 8px 20px;
  text-align: center;
  font-size: .85rem;
  line-height: 1.4;
  color: ${panelMutedText};
`;

const HintButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${colorPrimary};
  font: inherit;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
  }
`;

export default {
  ScrollableList,
  List,
  Empty,
  EmptyIcon,
  EmptyTitle,
  EmptyBody,
  EmptyAction,
  Hint,
  HintButton,
};
