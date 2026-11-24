import styled, { css, keyframes } from 'styled-components';
import {
  colorPrimary,
  colorWhite,
  panelBorder,
  panelMutedText,
  panelRowActionColor,
  panelRowActionHoverBg,
  panelTabsBg,
  panelText,
  stageControlBorder,
  timerDone,
  timerLow,
  timerLowText,
} from '/imports/ui/stylesheets/styled-components/palette';

const CONFETTI_COLORS = ['#5B8FE0', '#F5B74D', '#3ECF8E', '#C084FC', '#FF8A8F'];

const popIn = keyframes`
  from { opacity: 0; translate: 0 10px; scale: .97; }
  to { opacity: 1; translate: 0 0; scale: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
`;

const fall = keyframes`
  0% { transform: translateY(-20px) rotate(0); opacity: 1; }
  100% { transform: translateY(300px) rotate(560deg); opacity: 0; }
`;

const focusRing = css`
  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: 2px;
  }
`;

const resetButton = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  font-family: inherit;
  cursor: pointer;
  ${focusRing}
`;

interface SurfaceProps {
  $dragging: boolean;
  $low: boolean;
  $done: boolean;
  $animated: boolean;
}

const borderColor = ({ $low, $done }: SurfaceProps) => {
  if ($done) return timerDone;
  return $low ? timerLow : stageControlBorder;
};

const surface = css<SurfaceProps>`
  position: absolute;
  z-index: 5;
  box-sizing: border-box;
  border: 1.5px solid ${borderColor};
  background-color: ${colorWhite};
  color: ${panelText};
  box-shadow: ${({ $dragging }) => ($dragging
    ? '0 26px 60px rgba(15, 23, 36, .45)'
    : '0 16px 40px rgba(15, 23, 36, .28)')};
  cursor: ${({ $dragging }) => ($dragging ? 'grabbing' : 'grab')};
  touch-action: none;
  user-select: none;

  ${({ $animated }) => $animated && css`
    @media (prefers-reduced-motion: no-preference) {
      animation: ${popIn} .2s cubic-bezier(.2, .8, .2, 1) both;
    }
  `}
`;

const Card = styled.div<SurfaceProps>`
  ${surface}
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 280px;
  padding: 12px 16px 16px;
  border-radius: 22px;
  overflow: hidden;
`;

const Pill = styled.div<SurfaceProps>`
  ${surface}
  height: 40px;
  border-radius: 20px;
`;

const PillButton = styled.button`
  ${resetButton}
  gap: 8px;
  height: 100%;
  padding-inline: 6px 14px;
  border-radius: 20px;
  background: none;
  color: inherit;
  cursor: inherit;
`;

const PillTime = styled.span<{ $low: boolean }>`
  font-size: 17px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ $low }) => ($low ? timerLowText : panelText)};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  gap: 6px;
`;

const Grip = styled.button`
  ${resetButton}
  width: 24px;
  height: 26px;
  margin-inline-start: -6px;
  border-radius: 8px;
  background: none;
  color: ${panelMutedText};
  cursor: inherit;
`;

const Title = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 700;
`;

const Hint = styled.span`
  font-weight: 500;
  color: ${panelMutedText};
`;

const HeaderButton = styled.button`
  ${resetButton}
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background-color: ${panelTabsBg};
  color: ${panelRowActionColor};

  &:hover {
    background-color: ${panelRowActionHoverBg};
  }
`;

const Icon = styled.svg<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const RingWrapper = styled.div<{ $pulse: boolean }>`
  position: relative;
  width: 168px;
  height: 168px;

  ${({ $pulse }) => $pulse && css`
    @media (prefers-reduced-motion: no-preference) {
      animation: ${pulse} 1s ease-in-out infinite;
    }
  `}
`;

const RingContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

const Clock = styled.span<{ $low: boolean; $small: boolean }>`
  font-size: ${({ $small }) => ($small ? '30px' : '42px')};
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -.01em;
  font-variant-numeric: tabular-nums;
  color: ${({ $low }) => ($low ? timerLowText : panelText)};
`;

const ClockButton = styled.button<{ $low: boolean; $small: boolean }>`
  ${resetButton}
  padding: 0 6px;
  border-radius: 10px;
  background: none;
  font-size: ${({ $small }) => ($small ? '30px' : '42px')};
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -.01em;
  font-variant-numeric: tabular-nums;
  color: ${({ $low }) => ($low ? timerLowText : panelText)};
  cursor: text;

  &:hover {
    background-color: ${panelTabsBg};
  }
`;

const ClockInput = styled.input<{ $small: boolean }>`
  width: 128px;
  box-sizing: border-box;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background-color: ${panelTabsBg};
  color: ${panelText};
  font-family: inherit;
  font-size: ${({ $small }) => ($small ? '28px' : '38px')};
  line-height: 1.25;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: center;
  user-select: text;
  ${focusRing}

  &[aria-invalid='true'] {
    outline: 2px solid ${timerLow};
  }
`;

const ModeSwitch = styled.div`
  display: flex;
  align-self: stretch;
  gap: 2px;
  padding: 3px;
  border-radius: 12px;
  background-color: ${panelTabsBg};
`;

const ModeButton = styled.button<{ $selected: boolean }>`
  ${resetButton}
  flex: 1;
  height: 28px;
  border-radius: 9px;
  background-color: ${({ $selected }) => ($selected ? colorWhite : 'transparent')};
  color: ${({ $selected }) => ($selected ? panelText : panelRowActionColor)};
  font-size: 13px;
  font-weight: 700;

  &:disabled {
    cursor: not-allowed;
  }
`;

const MusicLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${panelMutedText};
`;

const MusicSelect = styled.select`
  height: 30px;
  padding: 0 8px;
  border: 1px solid ${panelBorder};
  border-radius: 8px;
  background-color: ${colorWhite};
  color: ${panelText};
  font: inherit;
  ${focusRing}
`;

const Status = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${panelMutedText};
`;

const Confetti = styled.div`
  position: absolute;
  left: 0;
  top: 40px;
  width: 100%;
  height: 1px;
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const ConfettiPiece = styled.span<{ $index: number }>`
  position: absolute;
  top: 0;
  left: ${({ $index }) => 14 + $index * 18}px;
  width: ${({ $index }) => ($index % 3 === 0 ? 8 : 6)}px;
  height: ${({ $index }) => ($index % 2 ? 12 : 8)}px;
  border-radius: 2px;
  background-color: ${({ $index }) => CONFETTI_COLORS[$index % CONFETTI_COLORS.length]};
  animation: ${fall} cubic-bezier(.3, .6, .5, 1) both;
  animation-delay: ${({ $index }) => (($index * 0.07) % 0.6).toFixed(2)}s;
  animation-duration: ${({ $index }) => (1.3 + ($index % 4) * 0.2).toFixed(1)}s;
`;

const Presets = styled.div`
  display: flex;
  gap: 6px;
`;

const Preset = styled.button<{ $selected: boolean }>`
  ${resetButton}
  height: 30px;
  padding: 0 11px;
  border: 1px solid ${({ $selected }) => ($selected ? colorPrimary : panelBorder)};
  border-radius: 15px;
  background-color: ${({ $selected }) => ($selected ? panelTabsBg : colorWhite)};
  color: ${({ $selected }) => ($selected ? colorPrimary : panelRowActionColor)};
  font-size: 13px;
  font-weight: 700;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RoundButton = styled.button`
  ${resetButton}
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${panelTabsBg};
  color: ${panelRowActionColor};

  &:hover {
    background-color: ${panelRowActionHoverBg};
  }
`;

const PlayButton = styled.button<{ $running: boolean }>`
  ${resetButton}
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({ $running }) => ($running ? panelTabsBg : colorPrimary)};
  color: ${({ $running }) => ($running ? panelText : colorWhite)};
  box-shadow: 0 6px 16px rgba(31, 98, 208, .25);
`;

const AddButton = styled(RoundButton)`
  width: auto;
  padding: 0 12px;
  color: ${panelText};
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
`;

export default {
  Card,
  Pill,
  PillButton,
  PillTime,
  Header,
  Grip,
  Title,
  Hint,
  HeaderButton,
  Icon,
  RingWrapper,
  RingContent,
  Clock,
  ClockButton,
  ClockInput,
  ModeSwitch,
  ModeButton,
  MusicLabel,
  MusicSelect,
  Status,
  Confetti,
  ConfettiPiece,
  Presets,
  Preset,
  Controls,
  RoundButton,
  PlayButton,
  AddButton,
};
