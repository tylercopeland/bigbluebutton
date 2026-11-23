import styled from 'styled-components';
import { ScrollboxVertical } from '/imports/ui/stylesheets/styled-components/scrollable';
import {
  colorPrimary,
  panelMutedText,
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

const Empty = styled.div`
  padding: 24px 8px;
  text-align: center;
  font-size: .9rem;
  color: ${panelMutedText};
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
  Hint,
  HintButton,
};
