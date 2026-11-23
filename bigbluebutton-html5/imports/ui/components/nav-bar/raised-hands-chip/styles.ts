import styled from 'styled-components';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import {
  roomControlBg,
  roomFocusRing,
  webcamRaisedHandBg,
  webcamRaisedHandColor,
} from '/imports/ui/stylesheets/styled-components/palette';

const Chip = styled.button`
  && {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 6px;
    height: 32px;
    box-sizing: border-box;
    margin-inline-end: 8px !important;
    padding: 0 10px 0 4px !important;
  }

  border: 1.5px dashed ${webcamRaisedHandBg};
  border-radius: 16px;
  background-color: transparent;
  color: #FFF;
  font-family: inherit;
  font-size: .8125rem;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;

  [dir="rtl"] && {
    padding: 0 4px 0 10px !important;
  }

  &:hover {
    background-color: ${roomControlBg};
  }

  &:focus-visible {
    outline: 2px solid ${roomFocusRing};
    outline-offset: 2px;
  }
`;

const Badge = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: ${webcamRaisedHandBg};
  color: ${webcamRaisedHandColor};
`;

const Label = styled.bdi`
  @media ${smallOnly} {
    display: none;
  }
`;

// Small screens only have room for the number
const Count = styled.span`
  display: none;

  @media ${smallOnly} {
    display: inline;
  }
`;

export default {
  Chip,
  Badge,
  Label,
  Count,
};
