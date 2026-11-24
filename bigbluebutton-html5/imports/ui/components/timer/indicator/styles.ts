import styled from 'styled-components';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import {
  colorPrimary,
  colorWhite,
  panelMutedText,
  panelText,
  stageControlBorder,
  timerLow,
  timerLowText,
} from '/imports/ui/stylesheets/styled-components/palette';

interface TimerButtonProps {
  $running: boolean;
  $low: boolean;
  disabled: boolean;
  hide: boolean;
}

const TimerWrapper = styled.div<{ $hidden: boolean }>`
  ${({ $hidden }) => $hidden && 'display: none;'}
  flex-shrink: 0;
  margin-inline-start: auto;
`;

const Timer = styled.div`
  display: flex;
`;

const TimerButton = styled.div<TimerButtonProps>`
  display: flex;
  align-items: center;
  height: 32px;
  margin: 0 4px;
  padding-inline: 5px 12px;
  box-sizing: border-box;
  border: 1.5px solid ${({ $low }) => ($low ? timerLow : stageControlBorder)};
  border-radius: 16px;
  background-color: ${colorWhite};
  color: ${({ $running }) => ($running ? panelText : panelMutedText)};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  ${({ $low }) => $low && `color: ${timerLowText};`}

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: 2px;
  }

  ${({ hide }) => hide && `
    @media ${smallOnly} {
      visibility: hidden;
    }
  `}
`;

const TimerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const TimerTime = styled.span`
  font-size: 1rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

export default {
  TimerWrapper,
  Timer,
  TimerButton,
  TimerContent,
  TimerTime,
};
