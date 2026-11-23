import styled, { css } from 'styled-components';
import ButtonWrappers from '/imports/ui/components/common/button-wrapper/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled as materialStyled } from '@mui/material/styles';
import {
  borderSize,
  borderSizeLarge,
  toastContentWidth,
  lgBorderRadius,
  borderRadiusRounded,
  smPadding,
  contentSidebarPadding,
} from '../../../stylesheets/styled-components/general';
import {
  colorGrayDark,
  colorWhite,
  colorPrimary,
  colorBlueLighter,
  colorText,
  colorGray,
  panelBorder,
  panelMutedText,
  panelRowActionColor,
  panelRowHoverBg,
  panelTabActiveColor,
  panelTabColor,
  panelTabsBg,
  panelText,
  stageControlActiveBg,
  timerLowText,
} from '../../../stylesheets/styled-components/palette';
import { TextElipsis } from '../../../stylesheets/styled-components/placeholders';
import Button from '/imports/ui/components/common/button/component';
import { ScrollboxVertical } from '/imports/ui/stylesheets/styled-components/scrollable';
import {
  Separator as BaseSeparator,
  PanelContent as BasePanelContent,
} from '/imports/ui/components/sidebar-content/styles';
import { fontSizeBase, textFontWeight } from '../../../stylesheets/styled-components/typography';

const Separator = styled(BaseSeparator)``;

const TimerSidebarContent = styled(BasePanelContent)``;

const TimerTitle = styled.div`
  ${TextElipsis};
  flex: 1;

  & > button, button:hover {
    max-width: ${toastContentWidth};
  }
`;
// @ts-ignore - JS code
const TimerMinimizeButton = styled(Button)`
  position: relative;
  background-color: ${colorWhite};
  display: block;
  margin: ${borderSizeLarge};
  margin-bottom: ${borderSize};
  padding-left: 0;
  padding-right: inherit;

  [dir="rtl"] & {
    padding-left: inherit;
    padding-right: 0;
  }

  > i {
    color: ${colorGrayDark};
    font-size: smaller;

    [dir="rtl"] & {
      -webkit-transform: scale(-1, 1);
      -moz-transform: scale(-1, 1);
      -ms-transform: scale(-1, 1);
      -o-transform: scale(-1, 1);
      transform: scale(-1, 1);
    }
  }

  &:hover {
    background-color: ${colorWhite};
  }
`;

const TimerContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
  min-height: 100%;
`;

const TimerType = styled.div`
  display: flex;
  padding: 3px;
  margin-bottom: 1.5rem;
  border-radius: 10px;
  background-color: ${panelTabsBg};
`;

const RingWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  padding: 1rem 0 1.5rem;
`;

const RingLabel = styled.div`
  position: absolute;
  inset: 1rem 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

const RingTime = styled.span<{ $low: boolean; $small: boolean }>`
  font-size: ${({ $small }) => ($small ? '28px' : '42px')};
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  color: ${({ $low }) => ($low ? timerLowText : panelText)};
`;

const RingStatus = styled.span`
  font-size: .85rem;
  font-weight: 600;
  color: ${panelMutedText};
`;
const TimerSwitchButton = styled.button<{ $selected: boolean }>`
  flex: 1;
  height: 32px;
  border: 0;
  border-radius: 7px;
  background-color: ${({ $selected }) => ($selected ? colorWhite : 'transparent')};
  color: ${({ $selected }) => ($selected ? panelTabActiveColor : panelTabColor)};
  ${({ $selected }) => $selected && 'box-shadow: 0 1px 3px rgba(15, 23, 36, .14);'}
  font-family: inherit;
  font-size: .85rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: 1px;
  }
`;

const TimeInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0;
  width: 100%;
  padding: 0.5rem 0 0;
`;

const TimeInputGroup = styled.div`
  display: flex;
  align-items: center;
  font-size: 2.2rem;
  color: ${colorGrayDark};
  justify-content: center;
  gap: 1rem; 
`;

// @ts-ignore - JS code
const IncrementDecrementButton = styled(Button)`
  border-radius: ${lgBorderRadius};
  width: 2.6rem;
  height: 1.2rem;
  min-width: 0;
  padding: 0;
  font-size: ${fontSizeBase};
  line-height: 0.9;
`;

const TimerSongsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-flow: column;
  margin-top: 1.5rem;
  width: 100%;
  padding: 12px 14px;
  box-sizing: border-box;
  border-radius: 12px;
  background-color: ${panelRowHoverBg};
`;

const TimerRow = `
  display: flex;
  flex-flow: row;
  flex-grow: 1;
`;

const TimerTracks = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  margin-top: 0.8rem;
  padding-left: 0;

  label {
    display: flex;
    align-items: center;
  }

  input[type="radio"] {
    margin: auto 0.5rem;
    accent-color: ${colorPrimary};
  }
`;

const TimerTrackItem = styled.div<{isSelected?: boolean}>`
  ${TimerRow}
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 0.125rem solid ${({ isSelected }) => (
    isSelected
      ? colorPrimary
      : `color-mix(in srgb, ${colorBlueLighter} 40%, transparent)`
  )};
  background-color: ${({ isSelected }) => (
    isSelected
      ? `color-mix(in srgb, ${colorBlueLighter} 15%, transparent)`
      : 'transparent'
  )};
  margin-bottom: 0.5rem;
  transition: all 120ms ease;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    width: 100%;
    cursor: pointer;
  }
`;

const TimerInput = styled.input<{isSelected: boolean}>`
  background: none;
  border: none;
  background-color: color-mix(in srgb, ${colorBlueLighter} 20%, transparent);
  color: ${colorPrimary};
  font-family: inherit;
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 600; 
  border-radius: ${borderRadiusRounded};
  font-variant-numeric: tabular-nums;
  text-align: center;
  width: 5rem; 
  height: 2.8rem;
  padding: 0.4rem 1rem 0.2rem 0;
  -moz-appearance: textfield;
  transition: all 150ms ease;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
    background-color: color-mix(in srgb, ${colorPrimary} 15%, transparent);
    box-shadow: 0 0 0 0.125rem ${colorPrimary};
  }

  ${({ isSelected }) => isSelected && css`
    background-color: color-mix(in srgb, ${colorPrimary} 15%, transparent);
    box-shadow: 0 0 0 0.125rem ${colorPrimary};
  `}

  &:disabled,
  &[disabled] {
    cursor: not-allowed;
    opacity: .75;
    background-color: transparent;
  }
`;

const TimeUnitContainer = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const TimeUnitLabel = styled.span`
  font-size: ${fontSizeBase};
  color: ${colorGray};
  text-transform: capitalize;
`;

const InputArrows = styled.div<{disabled?: boolean; isSelected?: boolean}>`
  position: absolute;
  right: 0;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  padding-right: 0.1rem;
  height: 2.8rem;
  width: 1.6rem;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 0.8)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  background: none;
  border: none;
  background-color: ${({ isSelected }) => (isSelected
    ? `color-mix(in srgb, ${colorPrimary} 15%, transparent)`
    : `color-mix(in srgb, ${colorBlueLighter} 20%, transparent)`)};
  border-radius: ${borderRadiusRounded};
  transition: all 150ms ease;
`;

// @ts-ignore - JS code
const InputArrowButton = styled(Button)<{isSelected?: boolean}>`
  flex: 1;
  min-width: auto;
  padding: 0;
  background: transparent !important;
  border: none;
  box-shadow: none !important;
  
  &:hover {
    background: transparent !important;
  }
  
  i {
    display: none;
  }
  
  &::before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-left: 0.25rem solid transparent;
    border-right: 0.25rem solid transparent;
    border-bottom: 0.28rem solid ${colorPrimary};
    margin: auto;
    transition: border-bottom-color 120ms ease;
  }
  
  &:hover::before {
    border-bottom-color: ${colorPrimary};
    opacity: 1;
  }
`;

// @ts-ignore - JS code
const InputArrowButtonDown = styled(Button)<{isSelected?: boolean}>`
  flex: 1;
  min-width: auto;
  padding: 0;
  background: transparent !important;
  border: none;
  box-shadow: none !important;
  
  &:hover {
    background: transparent !important;
  }
  
  i {
    display: none;
  }
  
  &::before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-left: 0.25rem solid transparent;
    border-right: 0.25rem solid transparent;
    border-top: 0.28rem solid ${colorPrimary};
    margin: auto;
    transition: border-top-color 120ms ease;
  }
  
  &:hover::before {
    border-top-color: ${colorPrimary};
    opacity: 1;
  }
`;

const TimerScrollableContent = styled(ScrollboxVertical)`
  flex-grow: 1;
  overflow-y: auto;
  margin: 0 ${smPadding} 0;
  padding: ${contentSidebarPadding} ${contentSidebarPadding} ${contentSidebarPadding};
  height: 100%;
`;

const MusicSwitchLabel = styled(FormControlLabel)`
  margin-left: 0 !important;

  .MuiFormControlLabel-label {
    color: ${colorGrayDark};
    font-size: ${fontSizeBase};
    font-weight: ${textFontWeight};
  }
`;

const MaterialSwitch = materialStyled(Switch)(({ theme }) => ({
  width: 24,
  height: 14,
  padding: 0,
  display: 'flex',
  marginRight: '0.5rem',
  '&:active': {
    '& .MuiSwitch-thumb': {
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: colorPrimary,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 7,
    height: 7,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
    transform: 'translateY(1px)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

const TimerPresetsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0 0.25rem 0;
  color: ${colorGrayDark};
`;

const timerChip = css`
  min-width: 44px;
  height: 30px;
  padding: 0 11px;
  box-sizing: border-box;
  border: 1px solid ${panelBorder};
  border-radius: 15px;
  background-color: ${colorWhite};
  color: ${panelRowActionColor};
  font-family: inherit;
  font-size: .85rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ${panelRowHoverBg};
  }

  &:focus-visible {
    outline: 2px solid ${colorPrimary};
    outline-offset: 1px;
  }

  &:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
`;

const TimerPresetButton = styled.button<{ $selected: boolean }>`
  ${timerChip}
  ${({ $selected }) => $selected && css`
    border-color: ${colorPrimary};
    background-color: ${stageControlActiveBg};
    color: ${colorPrimary};
  `}
`;

// @ts-ignore - JS code
const PresetArrowButton = styled(Button)`
  padding: 0.25rem 0.35rem;
  min-width: auto;
  
  i {
    margin: 0;
    font-size: ${fontSizeBase};
  }

  [dir="rtl"] & i {
    -webkit-transform: scale(-1, 1);
    -moz-transform: scale(-1, 1);
    -ms-transform: scale(-1, 1);
    -o-transform: scale(-1, 1);
    transform: scale(-1, 1);
  }
`;

const TimerAddsRow = styled.div`
  color: ${colorText};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0 0.25rem 0;
`;

const TimerAddButton = styled.button`
  ${timerChip}
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  padding-top: 1rem;
  gap: 0.75rem;
`;

const ButtonRow = styled.div`
  display: flex;

  button {
    min-height: 44px;
    border-radius: 12px;
  }

  width: 100%;
  gap: 1rem;
`;

const ButtonWrapper = ButtonWrappers.FullWidthFlexItem;

const FooterSeparator = styled(BaseSeparator)`
  margin-top: auto;
`;

export default {
  Separator,
  TimerSidebarContent,
  TimerTitle,
  TimerMinimizeButton,
  TimerContent,
  RingWrapper,
  RingLabel,
  RingTime,
  RingStatus,
  TimerType,
  TimerSwitchButton,
  TimeInputWrapper,
  TimeInputGroup,
  IncrementDecrementButton,
  TimerSongsWrapper,
  TimerTracks,
  TimerTrackItem,
  TimerInput,
  TimeUnitContainer,
  TimeUnitLabel,
  InputArrows,
  InputArrowButton,
  InputArrowButtonDown,
  TimerScrollableContent,
  MusicSwitchLabel,
  MaterialSwitch,
  ControlsContainer,
  ButtonRow,
  ButtonWrapper,
  FooterSeparator,
  TimerPresetsRow,
  TimerPresetButton,
  PresetArrowButton,
  TimerAddsRow,
  TimerAddButton,
};
