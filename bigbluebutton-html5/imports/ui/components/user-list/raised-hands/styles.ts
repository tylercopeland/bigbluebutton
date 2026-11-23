import styled from 'styled-components';
import { colorPrimary, roomFocusRing } from '/imports/ui/stylesheets/styled-components/palette';

const RaisedHandsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: -2px;
  }
`;

const LowerAllHandsButton = styled.button`
  flex-shrink: 0;
  padding: 2px 6px;
  border: 0;
  border-radius: 6px;
  background: none;
  color: ${colorPrimary};
  font-family: inherit;
  font-size: .8rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
  }
`;

export default {
  RaisedHandsContainer,
  List,
  LowerAllHandsButton,
};
